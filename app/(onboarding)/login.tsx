import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Eye, EyeOff, Mail, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '@/src/services/authService';

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

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginUser(email.trim(), password);
      router.replace('/(onboarding)/profile-setup');
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
      'Phone OTP is wired in authService. Add a Firebase app verifier (reCAPTCHA flow) and pass its verification ID to continue.'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View className="items-center mb-10">
            <Text className="font-headline text-4xl font-extrabold text-on-surface">Welcome Back</Text>
            <Text className="text-on-surface-variant mt-2 text-center">
              Sign in with email or phone OTP to continue.
            </Text>
          </View>

          <View className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl">
            <View className="bg-surface-container-low rounded-full p-1 flex-row mb-5">
              <TouchableOpacity
                onPress={() => setMode('email')}
                className={`flex-1 py-3 rounded-full items-center ${mode === 'email' ? 'bg-primary' : ''}`}
              >
                <Text className={mode === 'email' ? 'text-on-primary font-bold' : 'text-on-surface-variant font-semibold'}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('phone')}
                className={`flex-1 py-3 rounded-full items-center ${mode === 'phone' ? 'bg-primary' : ''}`}
              >
                <Text className={mode === 'phone' ? 'text-on-primary font-bold' : 'text-on-surface-variant font-semibold'}>
                  Phone OTP
                </Text>
              </TouchableOpacity>
            </View>

            {mode === 'email' ? (
              <>
                <Text className="text-on-surface-variant text-sm font-bold ml-1 mb-2">Email</Text>
                <View className="flex-row items-center bg-surface-container-high rounded-full px-5 h-14 mb-4">
                  <Mail color="#8f6f74" size={20} />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#8f6f74"
                    className="flex-1 ml-3 text-on-surface"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text className="text-on-surface-variant text-sm font-bold ml-1 mb-2">Password</Text>
                <View className="flex-row items-center bg-surface-container-high rounded-full px-5 h-14">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#8f6f74"
                    className="flex-1 text-on-surface"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff color="#8f6f74" size={20} /> : <Eye color="#8f6f74" size={20} />}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className="text-on-surface-variant text-sm font-bold ml-1 mb-2">Phone Number</Text>
                <View className="flex-row items-center bg-surface-container-high rounded-full px-5 h-14">
                  <Phone color="#8f6f74" size={20} />
                  <TextInput
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#8f6f74"
                    className="flex-1 ml-3 text-on-surface"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
                <Text className="text-on-surface-variant text-xs mt-3">
                  OTP verification is wired for Firebase flow. Set `EXPO_PUBLIC_PHONE_OTP_MOCK=true` for local testing.
                </Text>
              </>
            )}

            {errorMsg && (
              <View className="mt-4 px-4 py-3 bg-error-container rounded-xl">
                <Text className="text-on-error-container text-sm text-center font-medium">{errorMsg}</Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-6"
              disabled={isLoading}
              onPress={mode === 'email' ? handleEmailSignIn : handlePhoneOtp}
            >
              <LinearGradient colors={['#b7004e', '#e21364']} className="py-4 rounded-full flex-row items-center justify-center gap-2">
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-on-primary font-headline font-bold">Continue</Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-on-surface-variant">New here? </Text>
            <TouchableOpacity onPress={() => router.push('/(onboarding)/register')}>
              <Text className="text-primary font-bold">Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
