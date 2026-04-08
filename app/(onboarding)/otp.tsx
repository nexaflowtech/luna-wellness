import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OTPInput } from '@/src/components/onboarding/OTPInput';
import { ProgressIndicator } from '@/src/components/onboarding/ProgressIndicator';
import { verifyPhoneOtp } from '@/src/services/authService';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ verificationId?: string; phoneNumber?: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6 && otp.length !== 4) return;

    const verificationId = String(params.verificationId ?? '');
    if (!verificationId) {
      Alert.alert('Verification missing', 'Please request OTP again.');
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOtp(verificationId, otp);
      router.replace('/(onboarding)/profile-setup');
    } catch (error: any) {
      Alert.alert('OTP Failed', error?.message ?? 'Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="w-full flex-row items-center px-6 pt-4 mb-2">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center bg-surface-container-lowest shadow-sm">
            <ArrowLeft color="#181b27" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}>
          <ProgressIndicator currentStep={1} totalSteps={4} />

          <View className="mb-10 mt-4">
            <Text className="font-headline text-3xl font-extrabold tracking-tight text-on-surface leading-tight">
              Enter Verification Code
            </Text>
            <Text className="text-on-surface-variant font-medium text-base mt-3">
              We sent OTP to {String(params.phoneNumber ?? 'your phone number')}
            </Text>
          </View>

          <View className="mb-10 items-center w-full">
            <OTPInput length={6} value={otp} onChange={setOtp} />
          </View>

          <View className="items-center">
            <Text className="text-on-surface-variant mb-2">Didn&apos;t receive a code?</Text>
            <TouchableOpacity>
              <Text className="text-primary font-bold font-headline underline">Resend Code</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-end pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              className={`w-full mt-6 ${otp.length >= 4 ? '' : 'opacity-50'}`}
              onPress={handleVerify}
              disabled={otp.length < 4 || loading}
            >
              <LinearGradient colors={['#b7004e', '#e21364']} className="py-4 rounded-full flex-row items-center justify-center gap-2 shadow-lg">
                <Text className="text-on-primary font-headline font-bold text-base">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Text>
                {!loading && <ArrowRight color="#ffffff" size={20} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
