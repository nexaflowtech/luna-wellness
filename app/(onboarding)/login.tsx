import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { loginUser } from '@/src/services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { CarouselCard } from '@/src/components/onboarding/CarouselCard';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';

type AuthMode = 'email' | 'phone';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { onboardingComplete, onboardingStep } = useAuth();

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginUser(email.trim(), password);
      if (!onboardingComplete) {
        const resumeStep = onboardingStep || '/(onboarding)/gender';
        console.log('Post-login resume to:', resumeStep);
        router.replace(resumeStep as any);
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      const msg =
        e?.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : e?.message ?? 'Login failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneOtp = async () => {
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    Alert.alert(
      'Phone OTP Setup Needed',
      'Phone OTP is wired in authService. Add a Firebase app verifier (reCAPTCHA flow) to continue.'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center px-6 pt-10 pb-24">
              {/* Social Proof & Carousel */}
              <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center mb-10">
                <View className="bg-white/5 py-1.5 px-4 rounded-full mb-6">
                  <Text className="text-secondary text-[13px] font-extrabold tracking-widest uppercase">✨ 50,000+ transformations</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" snapToInterval={300} decelerationRate="fast">
                  <CarouselCard 
                    beforeImageUri="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80"
                    afterImageUri="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80"
                    resultTag="Lost 10kg in 3 months"
                  />
                </ScrollView>
                <Text className="text-4xl font-extrabold text-textPrimary text-center leading-[44px]">Welcome to Luna</Text>
                <Text className="text-textSecondary text-[16px] mt-3 text-center">
                  Your AI-powered health companion
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} className="rounded-[32px] p-6 bg-surface border border-white/5 shadow-2xl">
                {/* Mode Switcher */}
                <View className="rounded-full p-1.5 flex-row mb-6 bg-white/5">
                  <TouchableOpacity
                    onPress={() => setMode('email')}
                    activeOpacity={0.8}
                    className={`flex-1 py-3.5 rounded-full items-center ${mode === 'email' ? 'bg-primary' : 'bg-transparent'}`}
                  >
                    <Text className={`font-bold ${mode === 'email' ? 'text-white' : 'text-textSecondary'}`}>
                      Email
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMode('phone')}
                    activeOpacity={0.8}
                    className={`flex-1 py-3.5 rounded-full items-center ${mode === 'phone' ? 'bg-primary' : 'bg-transparent'}`}
                  >
                    <Text className={`font-bold ${mode === 'phone' ? 'text-white' : 'text-textSecondary'}`}>
                      Phone OTP
                    </Text>
                  </TouchableOpacity>
                </View>

                {mode === 'email' ? (
                  <Animated.View entering={FadeIn.duration(400)}>
                    <Text className="text-[13px] font-bold ml-1 mb-2 text-textSecondary uppercase tracking-wider">Email Address</Text>
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] mb-5 bg-background border border-white/10 focus:border-primary/50">
                      <Mail color="#A1A1AA" size={20} />
                      <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="#A1A1AA"
                        className="flex-1 ml-3 text-textPrimary text-[15px]"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>

                    <Text className="text-[13px] font-bold ml-1 mb-2 text-textSecondary uppercase tracking-wider">Password</Text>
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] bg-background border border-white/10 focus:border-primary/50">
                      <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#A1A1AA"
                        className="flex-1 text-textPrimary text-[15px]"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="p-2 -mr-2">
                        {showPassword ? <EyeOff color="#A1A1AA" size={20} /> : <Eye color="#A1A1AA" size={20} />}
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ) : (
                  <Animated.View entering={FadeIn.duration(400)}>
                    <Text className="text-[13px] font-bold ml-1 mb-2 text-textSecondary uppercase tracking-wider">Phone Number</Text>
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] bg-background border border-white/10 focus:border-primary/50">
                      <Phone color="#A1A1AA" size={20} />
                      <TextInput
                        placeholder="+91 98765 43210"
                        placeholderTextColor="#A1A1AA"
                        className="flex-1 ml-3 text-textPrimary text-[15px]"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  </Animated.View>
                )}

                {errorMsg && (
                  <Animated.View entering={FadeInDown.duration(300)} className="mt-5 px-4 py-3 bg-red-500/20 rounded-xl border border-red-500/30">
                    <Text className="text-red-400 text-[13px] text-center font-medium leading-[18px]">{errorMsg}</Text>
                  </Animated.View>
                )}

                <View className="mt-8">
                  <PrimaryButton 
                    title={mode === 'email' ? 'Sign In' : 'Send OTP'}
                    onPress={mode === 'email' ? handleEmailSignIn : handlePhoneOtp}
                    disabled={isLoading}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(400).duration(600)} className="flex-row justify-center mt-10">
                <Text className="text-textSecondary text-[13px] font-medium text-center px-6 leading-[20px]">
                  By continuing, you agree to our <Text className="text-white font-bold">Terms</Text> & <Text className="text-white font-bold">Privacy Policy</Text>
                </Text>
              </Animated.View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
