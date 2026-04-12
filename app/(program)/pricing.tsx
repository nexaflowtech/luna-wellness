import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { PricingCard } from '@/components/program/PricingCard';
import { ChecklistItem } from '@/components/program/ChecklistItem';
import { CountdownTimer } from '@/components/program/CountdownTimer';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { router } from 'expo-router';

export default function PricingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Full Access</Text>
          <Text style={styles.subtitle}>Commit to your health today and lock in our best rate.</Text>
        </View>

        <PricingCard>
          <Text style={styles.sectionTitle}>You will get</Text>
          
          <View style={styles.checklist}>
            <ChecklistItem text="Zumba Classes (30 Days)" />
            <ChecklistItem text="Diet Plan (Personalized)" />
            <ChecklistItem text="Coach Support" />
            <ChecklistItem text="AI Assistant" />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Total Investment</Text>
            <Text style={styles.priceValue}>₹1250<Text style={styles.priceMonth}>/month</Text></Text>
          </View>

        </PricingCard>

        {/* Countdown */}
        <CountdownTimer initialMinutes={8} initialSeconds={12} />

      </ScrollView>

      {/* CTA Bottom Lock */}
      <View style={styles.footer}>
        <PrimaryButton 
          title="Start Now" 
          onPress={() => router.push('/(program)/checkout')} 
        />
        <Text style={styles.guaranteeText}>30-Day Money-Back Guarantee</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  checklist: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 20,
  },
  priceBlock: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
  },
  priceMonth: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  guaranteeText: {
    marginTop: 16,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
