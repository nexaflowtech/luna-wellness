import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';

const OTP_LENGTH = 6;

export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const filled = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradNight} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verify your number ✉️</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={{ color: Colors.primaryLight, fontWeight: '700' }}>+91 •••• •• 4782</Text>
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        {/* OTP inputs */}
        <View style={styles.otpRow}>
          {Array(OTP_LENGTH).fill(null).map((_, i) => (
            <TextInput
              key={i}
              ref={(ref) => { if (ref) inputs.current[i] = ref; }}
              style={[
                styles.otpBox,
                activeIndex === i && styles.otpBoxActive,
                otp[i] && styles.otpBoxFilled,
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[i]}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              onFocus={() => setActiveIndex(i)}
            />
          ))}
        </View>

        <Button
          label="Verify & Continue"
          onPress={() => router.replace('/(onboarding)/profile-setup')}
          isLoading={false}
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive a code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend in 0:45</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 52,
    paddingHorizontal: 28,
    gap: 12,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 22 },
  card: {
    margin: 20,
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 28,
    gap: 20,
    ...Shadow.md,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  otpBoxActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  otpBoxFilled: { borderColor: Colors.primary },
  resendRow: { flexDirection: 'row', justifyContent: 'center' },
  resendText: { fontSize: 14, color: Colors.textSecondary },
  resendLink: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.primary },
});
