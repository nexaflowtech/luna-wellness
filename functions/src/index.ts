/**
 * FIREBASE CLOUD FUNCTION (Backend Proxy)
 * 
 * Deployment: save this file in `functions/src/index.ts` and run `firebase deploy --only functions`
 * 
 * This ensures the Anthropic API Key NEVER touches the React Native client app.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Firebase Admin allowing DB writes by the server
admin.initializeApp();
const db = admin.firestore();

// Initialize Anthropic Client securely
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Stored safely in Firebase Config/GCP Secret Manager
});

// Initialize Gemini Client securely
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateOnboardingPlanGemini = functions.https.onCall(async (data, context) => {
  // 1. Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { profile } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new functions.https.HttpsError('failed-precondition', 'Gemini API key is not configured on the server.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const prompt = `
You are Luna, an AI metabolic and endocrinology health coach.
Analyze the user's health profile below and generate a precise, medically-informed wellness plan.

USER HEALTH PROFILE:
${JSON.stringify(profile, null, 2)}

Respond ONLY with a valid JSON object matching this exact structure:
{
  "calorieRange": "string e.g. '1600-1850 kcal'",
  "macroSplit": {
    "protein": "string e.g. '120-140g'",
    "fiber": "string e.g. '25-35g'",
    "carbs": "string e.g. '150-180g'",
    "fat": "string e.g. '50-65g'"
  },
  "timelineEstimate": {
    "months": number,
    "description": "string — brief justification"
  },
  "metabolicProfile": "string — 1-2 sentences describing metabolic state",
  "hormonalRiskSignals": ["string array of risk flags, or ['None flagged'] if clean"],
  "planConfidenceScore": number between 0 and 100
}

Clinical constraints to follow:
- Calorie floor: NEVER below 1350 kcal/day for females
- PCOS users: lower carbs, higher protein, flag androgen risk
- Thyroid users: never recommend extreme low-carb; flag supplement timing
- Fertility users: ensure adequate iron and folate macro context
- Confidence score should reflect data completeness (more adaptiveAnswers = higher score)
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Strip any accidental markdown wrappers
    const cleanedText = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Gemini Onboarding Integration Error:", error);
    throw new functions.https.HttpsError('internal', error.message || 'AI generation failed.');
  }
});

export const askClaudeSonnet = functions.https.onCall(async (data, context) => {
  // 1. Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { chatId, userMessage, systemContext } = data;
  const uid = context.auth.uid;

  try {
    // 2. Fetch the last 5 messages for conversation memory
    const messagesRef = db.collection('coachChats').doc(chatId).collection('messages');
    const recentSnaps = await messagesRef.orderBy('createdAt', 'desc').limit(5).get();

    // Reverse to chronological
    const history = recentSnaps.docs.reverse().map(doc => {
      const d = doc.data();
      return {
        role: d.senderId === 'ai' ? 'assistant' : 'user',
        content: d.text,
      };
    });

    // 3. Request Claude 3.5 Sonnet Response
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Latest Sonnet model
      max_tokens: 1024,
      system: systemContext, // High-level personalized context generated via frontend AIContextBuilder
      messages: [
        ...history,
        { role: 'user', content: userMessage }
      ] as any,
      temperature: 0.7, // Balances creativity with analytical health advice
    });

    const aiReply = (message.content[0] as any).text;

    // 4. Update the parent document metadata for UI lists
    await db.collection('coachChats').doc(chatId).set({
      lastMessageText: aiReply,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    }, { merge: true });

    // 5. Return the reply to the React Native Client (client service saves it)
    // Alternatively, you can save the AI message directly to Firestore here.
    return { reply: aiReply };

  } catch (error) {
    console.error("Claude Integration Error:", error);
    throw new functions.https.HttpsError('internal', 'AI response failed.');
  }
});

export const generateOnboardingPlanClaude = functions.https.onCall(async (data, context) => {
  // 1. Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { userMessage, systemContext } = data;

  try {
    // 2. Request Claude 3.5 Sonnet Response as a one-shot generation
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: systemContext,
      messages: [
        { role: 'user', content: userMessage }
      ] as any,
      temperature: 0.2, // Lower temp for strict JSON output
    });

    const aiReply = (message.content[0] as any).text;

    return { reply: aiReply };

  } catch (error) {
    console.error("Claude Onboarding Integration Error:", error);
    throw new functions.https.HttpsError('internal', 'AI generation failed.');
  }
});
