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
import { CarouselCard } from '@/src/components/onboarding/CarouselCard';

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
      router.replace('/(onboarding)/gender');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0F' }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          {/* Social Proof & Carousel */}
          <View className="items-center mb-8">
            <Text style={{ color: '#00D4FF', fontWeight: 'bold', marginBottom: 12 }}>✨ 50,000+ transformations</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <CarouselCard 
                beforeImageUri="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80"
                afterImageUri="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80"
                resultTag="Lost 10kg in 3 months"
              />
            </ScrollView>
            <Text className="font-headline text-4xl font-extrabold text-[#F8FAFC]">Welcome Back</Text>
            <Text className="text-[#94A3B8] mt-2 text-center">
              Sign in with email or phone OTP to continue.
            </Text>
          </View>

          <View className="rounded-[24px] p-6 shadow-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <View className="rounded-full p-1 flex-row mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <TouchableOpacity
                onPress={() => setMode('email')}
                className={`flex-1 py-3 rounded-full items-center ${mode === 'email' ? '' : ''}`}
                style={{ backgroundColor: mode === 'email' ? 'rgba(124,58,237,0.4)' : 'transparent' }}
              >
                <Text style={{ color: mode === 'email' ? '#F8FAFC' : '#94A3B8', fontWeight: 'bold' }}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('phone')}
                className={`flex-1 py-3 rounded-full items-center ${mode === 'phone' ? '' : ''}`}
                style={{ backgroundColor: mode === 'phone' ? 'rgba(124,58,237,0.4)' : 'transparent' }}
              >
                <Text style={{ color: mode === 'phone' ? '#F8FAFC' : '#94A3B8', fontWeight: 'bold' }}>
                  Phone OTP
                </Text>
              </TouchableOpacity>
            </View>

            {mode === 'email' ? (
              <>
                <Text className="text-sm font-bold ml-1 mb-2" style={{ color: '#94A3B8' }}>Email</Text>
                <View className="flex-row items-center rounded-full px-5 h-14 mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Mail color="#94A3B8" size={20} />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-3 text-[#F8FAFC]"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text className="text-sm font-bold ml-1 mb-2" style={{ color: '#94A3B8' }}>Password</Text>
                <View className="flex-row items-center rounded-full px-5 h-14" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-[#F8FAFC]"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className="text-sm font-bold ml-1 mb-2" style={{ color: '#94A3B8' }}>Phone Number</Text>
                <View className="flex-row items-center rounded-full px-5 h-14" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Phone color="#94A3B8" size={20} />
                  <TextInput
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 ml-3 text-[#F8FAFC]"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
                <Text className="text-xs mt-3" style={{ color: '#94A3B8' }}>
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
              <LinearGradient colors={['#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="py-4 rounded-full flex-row items-center justify-center gap-2">
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-white font-headline font-bold">Continue</Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text style={{ color: '#94A3B8' }}>Auth flow simplified for demo purpose.</Text>
          </View>
          <View className="flex-row justify-center mt-8">
            <Text style={{ color: '#94A3B8', fontSize: 12 }}>By continuing, you agree to the Terms & Privacy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
