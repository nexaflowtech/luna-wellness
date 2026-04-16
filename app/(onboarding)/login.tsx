import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Phone, ArrowLeft, RefreshCw } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { loginUser, sendPhoneOtp, verifyPhoneOtp } from '@/src/services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { auth, app } from '@/src/config/firebase'; // Ensure 'app' is exported from firebase config
import { CarouselCard } from '@/src/components/onboarding/CarouselCard';
import { PrimaryButton } from '@/src/components/onboarding/PrimaryButton';
import { OtpInput } from '@/src/components/auth/OtpInput';

type AuthMode = 'email' | 'phone';
type PhoneStep = 'phone' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const [mode, setMode] = useState<AuthMode>('email');
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('phone');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState(''); // E.g. +91 9876543210
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { onboardingComplete, onboardingStep } = useAuth();

  // Timer logic for resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginUser(email.trim(), password);
      navigateAfterAuth();
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

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    // Auto-prepend +91 if missing and number seems local (10 digits)
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
      if (e?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Phone Authentication is not enabled in your Firebase Console. Please enable it under Auth -> Sign-in method.');
      } else if (e?.code === 'auth/billing-not-enabled') {
        setErrorMsg('SMS verification requires a Blaze plan. To test for free, add your number as a "Test Number" in the Firebase Console (Auth -> Settings).');
      } else if (e?.code === 'auth/invalid-phone-number') {
        setErrorMsg('Invalid phone number. Please check the format.');
      } else {
        setErrorMsg(e?.message || 'Failed to send OTP. Check your number.');
      }
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
      await verifyPhoneOtp(verificationId, codeToVerify);
      navigateAfterAuth();
    } catch (e: any) {
      console.error('Verify OTP Error:', e);
      setErrorMsg('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateAfterAuth = () => {
    if (!onboardingComplete) {
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
    <SafeAreaView className="flex-1 bg-background">
      {/* Firebase Recaptcha */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options} // Use standard firebase options
        attemptInvisibleRetries={10}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center px-6 pt-10 pb-24">

              {/* Header section (Carousel + Welcome) only visible in initial steps */}
              {phoneStep === 'phone' && (
                <Animated.View
                  entering={FadeInDown.duration(600).springify()}
                  exiting={FadeOut.duration(200)}
                  className="items-center mb-10"
                >
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
              )}

              <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} className="rounded-[32px] p-6 bg-surface border border-white/5 shadow-2xl">

                {/* Mode Switcher (only on initial step) */}
                {phoneStep === 'phone' && (
                  <View className="rounded-full p-1.5 flex-row mb-6 bg-white/5">
                    <TouchableOpacity
                      onPress={() => { setMode('email'); setErrorMsg(null); }}
                      activeOpacity={0.8}
                      className={`flex-1 py-3.5 rounded-full items-center ${mode === 'email' ? 'bg-primary' : 'bg-transparent'}`}
                    >
                      <Text className={`font-bold ${mode === 'email' ? 'text-white' : 'text-textSecondary'}`}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { setMode('phone'); setErrorMsg(null); }}
                      activeOpacity={0.8}
                      className={`flex-1 py-3.5 rounded-full items-center ${mode === 'phone' ? 'bg-primary' : 'bg-transparent'}`}
                    >
                      <Text className={`font-bold ${mode === 'phone' ? 'text-white' : 'text-textSecondary'}`}>Phone OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* EMAIL FORM */}
                {mode === 'email' && phoneStep === 'phone' && (
                  <Animated.View entering={FadeIn.duration(400)}>
                    <Text className="text-[13px] font-bold ml-1 mb-2 text-textSecondary uppercase tracking-wider">Email Address</Text>
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] mb-5 bg-background border border-white/10">
                      <Mail color="#7C3AED" size={20} />
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
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] bg-background border border-white/10">
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
                )}

                {/* PHONE INPUT FORM */}
                {mode === 'phone' && phoneStep === 'phone' && (
                  <Animated.View entering={FadeIn.duration(400)}>
                    <Text className="text-[13px] font-bold ml-1 mb-2 text-textSecondary uppercase tracking-wider">Phone Number</Text>
                    <View className="flex-row items-center rounded-2xl px-5 h-[60px] bg-background border border-white/10">
                      <Phone color="#7C3AED" size={20} />
                      <TextInput
                        placeholder="+91 98765 43210"
                        placeholderTextColor="#A1A1AA"
                        className="flex-1 ml-3 text-textPrimary text-[17px] font-bold"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                    <Text className="text-textSecondary text-[11px] mt-4 ml-1">
                      We'll send you a 6-digit verification code. Data rates may apply.
                    </Text>
                  </Animated.View>
                )}

                {/* OTP VERIFICATION FORM */}
                {phoneStep === 'otp' && (
                  <Animated.View entering={FadeIn.duration(400)}>
                    <TouchableOpacity
                      onPress={resetPhoneStep}
                      className="flex-row items-center mb-6"
                    >
                      <ArrowLeft color="#7C3AED" size={18} />
                      <Text className="text-primary font-bold ml-2">Change Number</Text>
                    </TouchableOpacity>

                    <Text className="text-2xl font-black text-white mb-2">Verify Code</Text>
                    <Text className="text-textSecondary text-[15px] mb-8">
                      Sent to <Text className="text-white font-bold">{phoneNumber}</Text>
                    </Text>

                    <OtpInput
                      onCodeFilled={(code) => {
                        setOtp(code);
                        handleVerifyOtp(code);
                      }}
                      isLoading={isLoading}
                    />

                    <View className="flex-row justify-between items-center mt-10">
                      {timer > 0 ? (
                        <Text className="text-textSecondary text-xs">Resend in <Text className="text-white font-bold">{timer}s</Text></Text>
                      ) : (
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          className="flex-row items-center"
                        >
                          <RefreshCw color="#7C3AED" size={14} />
                          <Text className="text-primary font-bold text-xs ml-1.5">Resend OTP</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Animated.View>
                )}

                {errorMsg && (
                  <Animated.View entering={FadeInDown.duration(300)} className="mt-5 px-4 py-3 bg-red-500/20 rounded-xl border border-red-500/30">
                    <Text className="text-red-400 text-[13px] text-center font-medium leading-[18px]">{errorMsg}</Text>
                  </Animated.View>
                )}

                {/* Action Button (only for initial step) */}
                {phoneStep === 'phone' && (
                  <View className="mt-8">
                    <PrimaryButton
                      title={mode === 'email' ? 'Sign In' : (isLoading ? 'Sending...' : 'Get OTP')}
                      onPress={mode === 'email' ? handleEmailSignIn : handleSendOtp}
                      loading={isLoading}
                    />
                  </View>
                )}

                {/* Action Button (optional manual verify for OTP step) */}
                {phoneStep === 'otp' && !isLoading && (
                  <View className="mt-8">
                    <PrimaryButton
                      title="Verify & Continue"
                      onPress={() => handleVerifyOtp()}
                      loading={isLoading}
                    />
                  </View>
                )}

                {isLoading && phoneStep === 'otp' && (
                  <View className="mt-8 items-center">
                    <ActivityIndicator color="#7C3AED" size="small" />
                    <Text className="text-textSecondary text-xs mt-2">Verifying...</Text>
                  </View>
                )}

              </Animated.View>

              {phoneStep === 'phone' && (
                <Animated.View entering={FadeIn.delay(400).duration(600)} className="flex-row justify-center mt-10">
                  <Text className="text-textSecondary text-[13px] font-medium text-center px-6 leading-[20px]">
                    By continuing, you agree to our <Text className="text-white font-bold">Terms</Text> & <Text className="text-white font-bold">Privacy Policy</Text>
                  </Text>
                </Animated.View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
