import { addDoc, collection, doc, serverTimestamp, setDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/src/config/firebase';
import { buildUserContext } from '@/src/utils/aiContextBuilder';

type AskClaudeSonnetRequest = {
  chatId: string;
  userMessage: string;
  systemContext: string;
};

type AskClaudeSonnetResponse = {
  reply: string;
};

export class AICoachService {
  private static MOCK_CLOUD_CALL = process.env.EXPO_PUBLIC_AI_MOCK === 'true';

  static async loadChatHistory(chatId: string) {
    const messagesRef = collection(db, 'coachChats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  }

  static async sendMessage(userId: string, chatId: string, userText: string) {
    const messagesRef = collection(db, 'coachChats', chatId, 'messages');
    const chatRef = doc(db, 'coachChats', chatId);

    await addDoc(messagesRef, {
      senderId: userId,
      text: userText,
      type: 'text',
      isRead: true,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      chatRef,
      {
        participants: [userId, 'ai'],
        createdBy: userId,
        updatedAt: serverTimestamp(),
        status: 'active',
      },
      { merge: true }
    );

    const systemContext = await buildUserContext(userId);

    let aiResponseText = '';
    if (this.MOCK_CLOUD_CALL) {
      await new Promise((res) => setTimeout(res, 1200));
      aiResponseText = [
        'MEAL_PLAN: Add protein + fiber at breakfast (eggs/tofu + oats + fruit).',
        'WORKOUT: 25-minute low-impact strength with mobility finisher.',
        'CYCLE_INSIGHT: Luteal phase support with magnesium-rich dinner and hydration.',
      ].join('\n');
    } else {
      const askClaude = httpsCallable<AskClaudeSonnetRequest, AskClaudeSonnetResponse>(functions, 'askClaudeSonnet');
      const result = await askClaude({
        chatId,
        userMessage: userText,
        systemContext,
      });
      aiResponseText = result.data.reply;
    }

    const aiDoc = await addDoc(messagesRef, {
      senderId: 'ai',
      text: aiResponseText,
      type: 'text',
      isRead: false,
      createdAt: serverTimestamp(),
    });

    return {
      id: aiDoc.id,
      text: aiResponseText,
    };
  }
}
