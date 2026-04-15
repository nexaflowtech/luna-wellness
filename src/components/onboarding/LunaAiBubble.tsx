import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

interface LunaAiBubbleProps {
  message: string;
  /** Optional sub-message shown below main message */
  subMessage?: string;
  /** Show typing dots before message appears */
  typing?: boolean;
}

const TypingDots = () => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, []);
  return (
    <View className="flex-row items-center gap-1 h-5">
      {[0, 1, 2].map(i => (
        <View
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60"
          style={{ opacity: dots.length > i ? 1 : 0.25 }}
        />
      ))}
    </View>
  );
};

export const LunaAiBubble: React.FC<LunaAiBubbleProps> = ({
  message,
  subMessage,
  typing = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const [showTyping, setShowTyping] = useState(typing);
  const [displayMessage, setDisplayMessage] = useState(typing ? '' : message);

  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Handle typing → message transition
  useEffect(() => {
    if (!typing) {
      setDisplayMessage(message);
      setShowTyping(false);
      return;
    }
    setShowTyping(true);
    setDisplayMessage('');
    const timer = setTimeout(() => {
      setShowTyping(false);
      setDisplayMessage(message);
    }, 1200);
    return () => clearTimeout(timer);
  }, [message, typing]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className="mx-6 mb-4"
    >
      <View
        className="rounded-[24px] p-4 bg-surface border border-white/8 flex-row items-start gap-3"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        {/* Luna Avatar */}
        <LinearGradient
          colors={['#7C3AED', '#F472B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-10 h-10 rounded-full items-center justify-center flex-shrink-0"
        >
          <Sparkles color="#ffffff" size={18} />
        </LinearGradient>

        {/* Message Area */}
        <View className="flex-1">
          <Text className="text-primary text-[11px] font-black uppercase tracking-widest mb-1">
            Luna AI
          </Text>
          {showTyping ? (
            <TypingDots />
          ) : (
            <>
              <Text className="text-textPrimary text-[14px] font-medium leading-[20px]">
                {displayMessage}
              </Text>
              {subMessage ? (
                <Text className="text-textSecondary text-[12px] mt-1 leading-[18px]">
                  {subMessage}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
};
