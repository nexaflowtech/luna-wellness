import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default function SignIn() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} bounces={false}>

        {/* Header Gradient */}
        <LinearGradient colors={Colors.gradNight} style={styles.header}>
          <Text style={styles.headerLabel}>LUNA WELLNESS</Text>
          <Text style={styles.headerTitle}>Welcome back 👋</Text>
          <Text style={styles.headerSub}>Sign in to continue your journey</Text>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.card}>
          <Input
            label="Email address"
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button label="Sign In" onPress={() => router.replace('/(setup)/profile')} />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            {[
              { label: 'Google', emoji: '🇬' },
              { label: 'Apple', emoji: '🍎' },
            ].map((s) => (
              <TouchableOpacity key={s.label} style={styles.socialBtn}>
                <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
                <Text style={styles.socialLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New to Luna? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 28,
    gap: 6,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  headerTitle: { fontSize: 30, fontWeight: FontWeight.extrabold, color: '#fff' },
  headerSub: { fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  card: {
    margin: 20,
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    ...Shadow.md,
  },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: FontWeight.medium },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.textMuted },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    paddingVertical: 14,
  },
  socialLabel: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.text },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerLink: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.primary },
});
