import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Send, Bot, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Message = { id: string; role: 'user' | 'eva'; text: string };

const QUICK_PROMPTS = [
  "What should I eat today?",
  "Best workout for my cycle phase?",
  "How to manage cortisol spikes?",
  "Explain my hormone score.",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'eva',
    text: "Hi! I'm Eva, your personal Luna AI coach 🌙\n\nI can help you with nutrition advice, workout guidance, hormone questions, and cycle-based planning. What's on your mind today?",
  },
];

export default function AICoachScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };

    // Static Eva response for demo purposes
    const evaResponses: Record<string, string> = {
      "What should I eat today?": "Based on your follicular phase today, I recommend:\n\n🥗 High-protein meals (eggs, tofu, lentils)\n🫐 Antioxidant-rich foods (berries, leafy greens)\n💧 At least 2.5L water\n\nYour insulin sensitivity is highest now — use it to fuel strength training!",
      "Best workout for my cycle phase?": "You're in your follicular phase — peak energy time! 💪\n\n✅ Full-body strength training\n✅ HIIT sessions (20–30 min)\n✅ High-intensity cardio\n\nAvoid: Intense training on Day 1–2 of period. Your body needs rest then.",
      "How to manage cortisol spikes?": "Cortisol management is key for hormonal balance:\n\n🌙 Sleep 7.5–8 hours consistently\n🧘 10 min guided meditation daily\n🚶 Walk 20 min post-meals\n🍵 Replace afternoon coffee with ashwagandha tea\n\nYour cortisol appears elevated — book a stress panel test.",
      "Explain my hormone score.": "Your hormone score is 54/100 — indicating moderate-high risk.\n\nKey observations:\n⚠️ Elevated cortisol affecting progesterone\n⚠️ Borderline insulin suggesting PCOS risk\n✅ Estrogen in normal range\n\nI recommend proceeding with the blood panel and uploading your results for a detailed AI analysis.",
    };

    const evaText = evaResponses[text.trim()] ?? "I'm analyzing your health profile to give you personalized advice. For best results, log your meals and symptoms daily so I can learn your patterns! 🌸";
    const evaMsg: Message = { id: (Date.now() + 1).toString(), role: 'eva', text: evaText };

    setMessages(prev => [...prev, userMsg, evaMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-3 gap-4 border-b border-white/5">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
            <ChevronLeft color="#fff" size={20} />
          </TouchableOpacity>
          <View className="w-12 h-12 rounded-full items-center justify-center" style={{ overflow: 'hidden' }}>
            <LinearGradient colors={['#7C3AED', '#F472B6']} className="w-full h-full items-center justify-center">
              <Bot color="white" size={22} />
            </LinearGradient>
          </View>
          <View className="flex-1">
            <Text className="text-white text-[18px] font-black">Eva</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-accent" />
              <Text className="text-accent text-[12px] font-bold">Luna AI Coach · Online</Text>
            </View>
          </View>
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
            <Sparkles color="#7C3AED" size={18} />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(msg => (
            <View key={msg.id} className={`flex-row gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'eva' && (
                <View className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-0.5">
                  <LinearGradient colors={['#7C3AED', '#F472B6']} className="w-full h-full items-center justify-center">
                    <Bot color="white" size={16} />
                  </LinearGradient>
                </View>
              )}
              <View
                className="rounded-[24px] px-5 py-4 max-w-[80%]"
                style={{
                  backgroundColor: msg.role === 'eva' ? '#14141A' : '#7C3AED',
                  borderWidth: 1,
                  borderColor: msg.role === 'eva' ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderTopLeftRadius: msg.role === 'eva' ? 4 : 24,
                  borderTopRightRadius: msg.role === 'user' ? 4 : 24,
                }}
              >
                <Text className="text-white text-[14px] leading-[22px]">{msg.text}</Text>
              </View>
            </View>
          ))}

          {/* Quick Prompts — only visible at start */}
          {messages.length === 1 && (
            <View className="gap-2 mt-2">
              <Text className="text-textSecondary text-[12px] font-bold uppercase tracking-widest ml-1">Ask Eva</Text>
              {QUICK_PROMPTS.map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => sendMessage(p)}
                  className="bg-surface border border-white/10 rounded-[20px] px-5 py-3.5"
                >
                  <Text className="text-white text-[14px] font-semibold">{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View className="px-4 py-4 border-t border-white/5 flex-row gap-3 items-end bg-background">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Eva anything..."
            placeholderTextColor="#555"
            multiline
            className="flex-1 bg-surface border border-white/10 rounded-[20px] px-5 py-4 text-white text-[14px]"
            style={{ maxHeight: 120 }}
          />
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ overflow: 'hidden' }}
          >
            <LinearGradient colors={['#7C3AED', '#F472B6']} className="w-full h-full items-center justify-center">
              <Send color="white" size={18} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}
