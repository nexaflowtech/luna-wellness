import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { SummaryCard } from '@/components/program/SummaryCard';
import { PrimaryButton } from '@/components/onboarding/PrimaryButton';
import { CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

const IncludedItem = ({ label }: { label: string }) => (
  <View style={styles.includedRow}>
    <Text style={styles.includedText}>{label}</Text>
    <CheckCircle2 color={Colors.success} size={18} />
  </View>
);

export default function CheckoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.subtitle}>Review your plan details before proceeding to secure payment.</Text>
        </View>

        <SummaryCard>
          <Text style={styles.sectionTitle}>Plan Includes:</Text>

          <View style={styles.list}>
            <IncludedItem label="Zumba" />
            <IncludedItem label="Diet" />
            <IncludedItem label="Coach" />
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.totalValue}>₹1475</Text>
              <Text style={styles.gstText}>(incl GST)</Text>
            </View>
          </View>
        </SummaryCard>

        {/* Trust Badges */}
        <View style={styles.trustWrap}>
          <ShieldCheck color={Colors.success} size={20} />
          <Text style={styles.trustText}>Secure & Encrypted Checkout</Text>
        </View>

      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Proceed to Pay"
          onPress={() => {
            // Replace with actual payment gateway integration
            console.log('Proceeding to payment');
            router.replace('/(tabs)');
          }}
          showArrow
        />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  includedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  includedText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  gstText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  trustWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  trustText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
});
