import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '@/src/services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await registerUser(email.trim(), password);
      // Explicitly push to the next step since AuthGate assumes (onboarding) is already okay
      router.replace('/(onboarding)/otp' as any);
    } catch (e: any) {
      const msg = e?.code === 'auth/email-already-in-use'
        ? 'Email already in use.'
        : e?.message ?? 'Registration failed.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-md space-y-12">
            <View className="items-center space-y-4 mb-4">
              <Text className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                Join Luna
              </Text>
              <Text className="text-on-surface-variant font-medium text-lg text-center px-4">
                Create your account to start your journey.
              </Text>
            </View>

            <View className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full">
              <View className="space-y-4">
                {/* Email */}
                <View>
                  <Text className="font-headline text-sm font-bold text-on-surface-variant ml-1 mb-2">
                    Email
                  </Text>
                  <View className={`flex-row items-center bg-surface-container-high rounded-full px-5 h-14 transition-all ${emailFocus ? 'bg-white border-2 border-primary' : 'border-2 border-transparent'}`}>
                    <Mail color="#8f6f74" size={20} className="mr-3" />
                    <TextInput
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      placeholder="Email address"
                      placeholderTextColor="#8f6f74"
                      className="flex-1 text-on-surface font-medium"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                {/* Password */}
                <View>
                  <Text className="font-headline text-sm font-bold text-on-surface-variant ml-1 mb-2">
                    Password
                  </Text>
                  <View className={`flex-row items-center bg-surface-container-high rounded-full px-5 h-14 transition-all ${passwordFocus ? 'bg-white border-2 border-primary' : 'border-2 border-transparent'}`}>
                    <Lock color="#8f6f74" size={20} className="mr-3" />
                    <TextInput
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                      placeholder="••••••••"
                      placeholderTextColor="#8f6f74"
                      className="flex-1 text-on-surface font-medium"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff color="#8f6f74" size={20} /> : <Eye color="#8f6f74" size={20} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View>
                  <Text className="font-headline text-sm font-bold text-on-surface-variant ml-1 mb-2">
                    Confirm Password
                  </Text>
                  <View className={`flex-row items-center bg-surface-container-high rounded-full px-5 h-14 transition-all ${confirmPasswordFocus ? 'bg-white border-2 border-primary' : 'border-2 border-transparent'}`}>
                    <Lock color="#8f6f74" size={20} className="mr-3" />
                    <TextInput
                      onFocus={() => setConfirmPasswordFocus(true)}
                      onBlur={() => setConfirmPasswordFocus(false)}
                      placeholder="••••••••"
                      placeholderTextColor="#8f6f74"
                      className="flex-1 text-on-surface font-medium"
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                </View>

                {errorMsg && (
                  <View className="mt-2 px-4 py-3 bg-[#ffdad6] rounded-xl">
                    <Text className="text-[#93000a] text-sm font-medium text-center">{errorMsg}</Text>
                  </View>
                )}

                <TouchableOpacity 
                   activeOpacity={0.8} 
                   className="w-full mt-4"
                   onPress={handleSignUp}
                   disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#b7004e', '#e21364']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-4 rounded-full flex-row items-center justify-center gap-2 shadow-lg"
                  >
                    {isLoading 
                      ? <ActivityIndicator color="#ffffff" size="small" />
                      : <>
                        <Text className="text-on-primary font-headline font-bold text-base">
                          Sign Up
                        </Text>
                        <ArrowRight color="#ffffff" size={20} />
                      </>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-center mt-4">
              <Text className="text-on-surface-variant font-medium">
                 Already have an account? 
              </Text>
              <TouchableOpacity onPress={() => router.replace('/(onboarding)/login' as any)}>
                <Text className="text-primary font-bold ml-1">
                   Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
