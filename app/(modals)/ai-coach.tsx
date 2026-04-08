import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Avatar } from '@/components/atoms/Avatar';
import { useAuth } from '@/src/context/AuthContext';

type Role = 'assistant' | 'user';

const INITIAL_MESSAGES: { id: string; role: Role; text: string; time: string }[] = [
  { id: '1', role: 'assistant', text: 'Hi Priya! 👋 I\'m your Luna AI Coach. I\'ve reviewed your health profile and this week\'s data. How can I help you today?', time: '9:00 AM' },
  { id: '2', role: 'user', text: 'What should I eat before a morning workout?', time: '9:01 AM' },
  { id: '3', role: 'assistant', text: 'Great question! For morning workouts, aim for a light snack 30–45 min before exercise:\n\n• 🍌 Banana + almond butter\n• 🥣 Small bowl of oats with honey\n• 🥚 1 boiled egg + whole grain toast\n\nAvoid heavy proteins or fiber-dense foods that can cause digestive discomfort mid-sweat. Stay hydrated!', time: '9:01 AM' },
  { id: '4', role: 'user', text: 'Thanks! Also why am I not losing weight despite working out?', time: '9:03 AM' },
  { id: '5', role: 'assistant', text: 'This is very common! Looking at your data, I notice a few things:\n\n1. 📊 Your calorie intake is slightly over target (avg. +180 kcal/day)\n2. 😴 Your sleep has been under 7 hrs which raises cortisol\n3. 💧 Hydration is often below goal\n\nFocus on these three this week and I predict you\'ll break through. Want me to adjust your meal plan?', time: '9:04 AM' },
];

const SUGGESTIONS = ['Adjust meal plan', 'Show today\'s workout', 'Sleep tips', 'Log symptom'];

import { AICoachService } from '@/services/aiCoachService';

export default function AICoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const send = async () => {
    if (!input.trim() || isTyping || !user) return;
    
    const userText = input.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', text: userText, time: now },
    ]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await AICoachService.sendMessage(user.uid, `coach_${user.uid}`, userText);
      
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        { id: response.id, role: 'assistant', text: response.text, time: aiTime },
      ]);
    } catch (error) {
      console.error('Claude API Error:', error);
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          text: 'I could not reach Luna AI just now. Please try again in a moment.',
          time: errorTime,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={Colors.gradNight} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.aiAvatar}>
              <Text style={{ fontSize: 22 }}>🤖</Text>
            </View>
            <View>
              <Text style={styles.aiName}>Luna AI Coach</Text>
              <Text style={styles.aiStatus}>● Online · Powered by AI</Text>
            </View>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.msgWrap, m.role === 'user' ? styles.userWrap : styles.aiWrap]}
          >
            {m.role === 'assistant' && (
              <View style={styles.aiAvatarSmall}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
            )}
            <View style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, m.role === 'user' && { color: '#fff' }]}>
                {m.text}
              </Text>
              <Text style={[styles.bubbleTime, m.role === 'user' && { color: 'rgba(255,255,255,0.6)' }]}>
                {m.time}
              </Text>
            </View>
          </View>
        ))}

        {/* Quick replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.suggestion}
              onPress={() => setInput(s)}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI coach..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={send}
          style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
        >
          <LinearGradient colors={Colors.gradPrimary} style={styles.sendBtnGrad}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>↑</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiName: { fontSize: 16, fontWeight: FontWeight.bold, color: '#fff' },
  aiStatus: { fontSize: 12, color: Colors.success, marginTop: 2 },
  messages: { padding: 16, gap: 16, paddingBottom: 8 },
  msgWrap: { flexDirection: 'row', gap: 8, maxWidth: '90%' },
  userWrap: { alignSelf: 'flex-end' },
  aiWrap: { alignSelf: 'flex-start', alignItems: 'flex-end' },
  aiAvatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubble: {
    borderRadius: 20,
    padding: 14,
    gap: 6,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 6,
    ...Shadow.sm,
  },
  bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  bubbleTime: { fontSize: 11, color: Colors.textMuted, textAlign: 'right' },
  suggestions: { paddingHorizontal: 4, gap: 8 },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  suggestionText: { fontSize: 13, color: Colors.primary, fontWeight: FontWeight.medium },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: { alignSelf: 'flex-end' },
  sendBtnGrad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
