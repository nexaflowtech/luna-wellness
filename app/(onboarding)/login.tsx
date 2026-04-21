import React, { useState, useRef, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react-native';
// Reanimated removed — plain View used instead
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { sendPhoneOtp, verifyPhoneOtp } from '@/src/services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { app } from '@/src/config/firebase';
import { CarouselCard } from '@/src/components/onboarding/CarouselCard';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { OtpInput } from '@/src/components/auth/OtpInput';

type PhoneStep = 'phone' | 'otp';

const RECENT_TRANSFORMATIONS = [
  {
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJIGGXlr9Lamao4xquWgA8nLjRngc2vuLB1LsIBrynsyQCPKRCY3nn8m0tQ9E53ypEQiilLY0MWCsmzL6Ub2WruEJx6qA1HYpLKt31Vi7shBzRL3Jq_f2VxdVVdQBRxQgGEyxJOuZXgP5X0kohx7Y8hr7ctq5X6nYjgQiOagwTl1hiqODdXX8J7NHccr59lwwnP7dfS7ERujKqSZ5by2vpP2xurNGS_1ormm72eJLV_9vleEzH0mPO3hRkJG1J2RhX3T75z0tFDzLM',
    tag: 'Weight Loss',
    quote: 'I lost 12kg and gained a whole new perspective on life.',
    tagColor: 'rgba(59, 130, 246, 0.2)'
  },
  {
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUCHjkdUM6VYOyydCinV5CMgldy3H69McBzQ0clIhZgFQrybM56CHJLmTQrwkuDv0DvzTywbYVjJnpN0Hh3fiHguzDAbxdrrDvYUuDdl3_HqcJVi0U4cyGWhj2cNh66bQMGxuQAXSAwA3HJ7mYUJKxJJHpLmjKSzKpFfhj_KZOhiYYZ4CAEr9BPdK5ahlRIGZywyDnZtvkRL8Uq2gMiChDL59AKuHPGi570aAZSZQS1tQ_lxdhu8cliSXMfpzgI1OsFnKfch9TV9r7',
    tag: 'PCOS Management',
    quote: 'Balanced hormones and regular cycles finally achieved naturally.',
    tagColor: 'rgba(124, 58, 237, 0.2)'
  }
];

export default function LoginScreen() {
  const router = useRouter();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const [phoneStep, setPhoneStep] = useState<PhoneStep>('phone');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Note: We do NOT use onboardingComplete from context for navigation.
  // Context can be stale right after OTP verify. We use fresh Firestore read instead.
  const { onboardingStep } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (timer > 0) return; // Rate limiting / Spam prevention
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms & Privacy Policy to continue.');
      return;
    }

    let formattedNumber = phoneNumber.trim();
    if (formattedNumber.length === 10 && !formattedNumber.startsWith('+')) {
      formattedNumber = `+91${formattedNumber}`;
      setPhoneNumber(formattedNumber);
    } else if (!formattedNumber.startsWith('+')) {
      setErrorMsg('Please include country code (e.g., +91).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (!recaptchaVerifier.current) return;
      const vid = await sendPhoneOtp(formattedNumber, recaptchaVerifier.current);
      setVerificationId(vid);
      setPhoneStep('otp');
      setTimer(30);
    } catch (e: any) {
      console.error('Send OTP Error:', e);
      setErrorMsg(e?.message || 'Failed to send OTP. Check your number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (codeValue?: string) => {
    const codeToVerify = codeValue || otp;
    if (codeToVerify.length !== 6) {
      setErrorMsg('Please enter the 6-digit code.');
      return;
    }

    if (!verificationId) {
      setErrorMsg('Session expired. Please request a new OTP.');
      setPhoneStep('phone');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      // verifyPhoneOtp now returns { user, isNewUser } from a fresh Firestore read
      // This avoids the race condition with stale AuthContext state
      const { isNewUser } = await verifyPhoneOtp(verificationId, codeToVerify);
      navigateAfterAuth(isNewUser);
    } catch (e: any) {
      console.error('Verify OTP Error:', e);
      const code = (e as any)?.code ?? '';
      if (code === 'auth/invalid-verification-code') {
        setErrorMsg('Invalid OTP. Please check and try again.');
      } else if (code === 'auth/code-expired') {
        setErrorMsg('OTP expired. Please request a new code.');
        setPhoneStep('phone');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Too many attempts. Please wait a moment and try again.');
      } else {
        setErrorMsg(e?.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // isNewUser: fresh from Firestore — no race condition with AuthContext snapshot
  const navigateAfterAuth = (isNewUser: boolean) => {
    if (isNewUser) {
      // Resume from last saved onboarding step or start from gender
      const resumeStep = onboardingStep || '/(onboarding)/gender';
      router.replace(resumeStep as any);
    } else {
      router.replace('/(tabs)');
    }
  };

  const resetPhoneStep = () => {
    setPhoneStep('phone');
    setVerificationId(null);
    setOtp('');
    setErrorMsg(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 flex-col bg-surface-container-lowest overflow-hidden relative">

              {/* Header Branding */}
              <View className="p-8 pb-4 flex-row items-center gap-2">
                <Sparkles color="#006e2f" size={24} />
                <Text className="text-xl font-extrabold text-on-surface tracking-tighter">Luna Wellness</Text>
              </View>

              {phoneStep === 'phone' && (
                <View>
                  <View className="w-full">
                    {/* Transformation Carousel */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="px-8 py-4 mb-4"
                      snapToInterval={280}
                      decelerationRate="fast"
                    >
                      {RECENT_TRANSFORMATIONS.map((item, index) => (
                        <CarouselCard key={index} {...item} />
                      ))}
                    </ScrollView>

                    {/* Narrative Section */}
                    <View className="p-8 pt-6">
                      <Text className="text-3xl font-bold text-on-surface tracking-tight mb-2 leading-tight">
                        Your Journey to Wellness Starts Here
                      </Text>
                      <Text className="text-on-surface-variant text-sm font-medium">
                        Join 50k+ women transforming their lives with personalized care.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View className="px-8 pb-8 space-y-6">
                {phoneStep === 'phone' ? (
                  <View className="space-y-6">
                    {/* Phone Input Box */}
                    <View className="relative">
                      <View className="absolute z-10 -top-2.5 left-4 bg-surface-container-lowest px-1">
                        <Text className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Phone Number</Text>
                      </View>
                      <View className="flex-row items-center border-2 border-surface-container-low rounded-2xl p-4 h-[65px] focus:border-primary">
                        <Text className="text-on-surface-variant font-bold border-r border-outline-variant pr-4 mr-4">+91</Text>
                        <TextInput
                          placeholder="98765 43210"
                          placeholderTextColor="#bccbb9"
                          className="flex-1 p-0 text-lg font-bold tracking-wide text-on-surface"
                          keyboardType="phone-pad"
                          value={phoneNumber}
                          onChangeText={(text) => setPhoneNumber(text.replace('+91', '').trim())}
                        />
                      </View>
                    </View>

                    {errorMsg && (
                      <View className="bg-error-container/30 px-4 py-3 rounded-xl border border-error/10">
                        <Text className="text-error text-xs font-semibold text-center">{errorMsg}</Text>
                      </View>
                    )}

                    <PrimaryButton
                      title="Get OTP"
                      loading={isLoading}
                      disabled={!phoneNumber.trim() || phoneNumber.trim().length < 10 || !termsAccepted}
                      onPress={handleSendOtp}
                    />

                    {/* Terms Checkbox */}
                    <TouchableOpacity
                      onPress={() => setTermsAccepted(!termsAccepted)}
                      className="flex-row items-start px-1 mt-2"
                    >
                      <View className={`w-5 h-5 rounded-md border-2 items-center justify-center ${termsAccepted ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                        {termsAccepted && <Text className="text-white text-[10px] font-bold">✓</Text>}
                      </View>
                      <Text className="text-[11px] leading-relaxed text-on-surface-variant font-medium ml-3 flex-1">
                        By continuing, I agree to the <Text className="text-primary font-bold">Terms of Service</Text> and <Text className="text-primary font-bold">Privacy Policy</Text>.
                      </Text>
                    </TouchableOpacity>

                    {/* Social Connect */}
                    <View className="mt-8">
                      <View className="flex-row items-center justify-center gap-4 mb-6">
                        <View className="h-[1px] flex-1 bg-surface-container-low" />
                        <Text className="text-[10px] font-bold tracking-widest uppercase text-outline">Social Connect</Text>
                        <View className="h-[1px] flex-1 bg-surface-container-low" />
                      </View>

                      <View className="flex-row justify-center gap-6">
                        <SocialButton iconUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCkglJhFV7-p3ALD4N_Iz7qJAz76VBHMh_uIHk3wVxQl5DvCRQOZmpCFXFeje4ME3SJrK9qSUn3SyzLVoNQ0UYEpACaYrBRJt7yCagF2SO1-0r6J4gZsFSqhQE4RBq3CIK5ZhQtJcXCOMVpVJUr8YerMuhsPV2tbwzhUm8iU0TcgrmwxVjW8q9WIX5N-3NWmGBP-fVTiiKG5HA4Mphh3QG0Ygv7wN2Hd7CRxEIM08Pec3sjMfIN0M9yXRDDUXzS0iOPQgJqdLMfX64D" />
                        <SocialButton iconUri="https://lh3.googleusercontent.com/aida-public/AB6AXuD2zfx5zodBRu4uPKJGjFYXNU4SfSr4mL6QqLjysbeflwabKnBg1TIA-id9Npsh52VWLUJ0wro9Bh_P0JQy1vAWbQvk5XCZVR2Pyrw_zzlV116_29ha7rtrdkdzFLbhe7-tCWNbFZWkxLmHR8lxzXIQnV0vsPqm377GKN__XbxQi0RNUlO2e7uiZH7DwIYvl8j-d5EDYiRlgMD8dh31Hjo_Uh6gSuURxNPJxh89aMxBrSfdXAb3tmazAqFxDo0gl0VijUDaXQYOY-na" />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity onPress={resetPhoneStep} className="flex-row items-center mb-6">
                      <ArrowLeft color="#006e2f" size={18} />
                      <Text className="text-primary font-bold ml-2">Change Number</Text>
                    </TouchableOpacity>

                    <Text className="text-3xl font-black text-on-surface mb-2 tracking-tighter">Verify Code</Text>
                    <Text className="text-on-surface-variant text-[15px] mb-10">Sent to <Text className="text-primary font-bold">{phoneNumber}</Text></Text>

                    <OtpInput
                      onCodeFilled={(code) => handleVerifyOtp(code)}
                      isLoading={isLoading}
                    />

                    {errorMsg && (
                      <View className="bg-error-container/30 px-4 py-3 rounded-xl border border-error/10 mt-6">
                        <Text className="text-error text-xs font-semibold text-center">{errorMsg}</Text>
                      </View>
                    )}

                    <PrimaryButton
                      title="Verify & Continue"
                      className="mt-10"
                      loading={isLoading}
                      onPress={() => handleVerifyOtp()}
                    />

                    <View className="flex-row justify-center items-center mt-8">
                      {timer > 0 ? (
                        <Text className="text-on-surface-variant text-xs">Resend in <Text className="text-primary font-bold">{timer}s</Text></Text>
                      ) : (
                        <TouchableOpacity onPress={handleSendOtp} className="flex-row items-center">
                          <RefreshCw color="#006e2f" size={14} />
                          <Text className="text-primary font-bold text-xs ml-1.5">Resend OTP</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* Version Footer */}
              <View className="mt-auto p-8 items-center">
                <Text className="text-[10px] font-bold tracking-widest uppercase text-outline">
                  LUNA WELLNESS VERSION 2.4.1
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialButton({ iconUri }: { iconUri: string }) {
  return (
    <TouchableOpacity className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center shadow-sm">
      <Image source={{ uri: iconUri }} className="w-6 h-6" resizeMode="contain" />
    </TouchableOpacity>
  );
}
