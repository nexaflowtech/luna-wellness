import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { GlassCard } from '@/components/onboarding/GlassCard';
import { CarouselCard } from '@/components/onboarding/CarouselCard';

export default function SignIn() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} bounces={false}>
        
        {/* TOP: Transformation carousel & social proof */}
        <View style={styles.topSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={316} // width 300 + 16 margin
            decelerationRate="fast"
          >
            <CarouselCard 
              beforeImageUri="https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=200&auto=format&fit=crop"
              afterImageUri="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop"
              resultTag="Lost 13kg using Zumba + Diet Plan"
            />
            <CarouselCard 
              beforeImageUri="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
              afterImageUri="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop"
              resultTag="Lost 8kg using HIIT + Keto"
            />
          </ScrollView>

          <View style={styles.socialProof}>
            <Text style={styles.socialProofText}>⭐ 50,000+ transformations</Text>
          </View>
        </View>

        {/* MIDDLE: Welcome message */}
        <View style={styles.middleSection}>
          <Text style={styles.welcomeTitle}>
            Start your personalized transformation journey
          </Text>
          <Text style={styles.welcomeSub}>
            Join thousands of women who have transformed their lives with Luna Wellness.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* BOTTOM: Terms, Privacy, Button */}
        <View style={styles.bottomSection}>
          <GlassCard style={styles.actionCard}>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
            
            <PrimaryButton 
              title="Continue" 
              onPress={() => router.replace('/(tabs)')} 
              showArrow 
            />
          </GlassCard>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    paddingBottom: 24,
  },
  carouselContainer: {
    paddingHorizontal: 12,
  },
  socialProof: {
    marginTop: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  socialProofText: {
    fontSize: 14,
    color: '#7C3AED', // Primary color
    fontWeight: '600',
  },
  middleSection: {
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827', // Text Primary
    textAlign: 'center',
    lineHeight: 34,
  },
  welcomeSub: {
    fontSize: 15,
    color: '#6B7280', // Text Secondary
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },
});
