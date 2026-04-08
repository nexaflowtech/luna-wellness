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

// Initialize Firebase Admin allowing DB writes by the server
admin.initializeApp();
const db = admin.firestore();

// Initialize Anthropic Client securely
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Stored safely in Firebase Config/GCP Secret Manager
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
