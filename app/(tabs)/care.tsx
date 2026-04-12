import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { MedicalCard } from '@/components/care/MedicalCard';
import { FeatureGrid } from '@/components/dashboard/FeatureGrid';
import { ShieldAlert, ActivitySquare, HeartPulse, Stethoscope, Microscope, Brain, FileText, Droplets, Apple } from 'lucide-react-native';

export default function CareScreen() {
  const diagnosticsFeatures = [
    { id: 'blood', title: 'Blood Work', icon: <Droplets color={Colors.accent} size={24} /> },
    { id: 'hormonal', title: 'Hormone Map', icon: <HeartPulse color={Colors.primary} size={24} /> },
    { id: 'gut', title: 'Gut Health', icon: <Apple color={Colors.success} size={24} /> },
    { id: 'reports', title: 'My Reports', icon: <FileText color={Colors.warning} size={24} /> },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#ffffff' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>We Care</Text>
          <Text style={styles.subtitle}>Your clinical ecosystem and medical diagnostics, backed by AI.</Text>
        </View>

        {/* Primary Medical Trackers */}
        <Text style={styles.sectionTitle}>Primary Trackers</Text>
        <MedicalCard 
          title="Symptom Checker" 
          subtitle="Log symptoms for AI clinical mapping"
          icon={<ShieldAlert color={Colors.primary} size={24} />}
          alert="3 symptoms tracked this week"
        />
        <MedicalCard 
          title="Cycle Tracker" 
          subtitle="Algorithm-based ovulation & period prediction"
          icon={<ActivitySquare color={Colors.accent} size={24} />}
        />

        {/* Clinical Services */}
        <Text style={styles.sectionTitle}>Clinical Services</Text>
        <MedicalCard 
          title="Doctor Consultation" 
          subtitle="Speak to verified Specialists via video call"
          icon={<Stethoscope color={Colors.success} size={24} />}
        />
        <MedicalCard 
          title="Health Insights" 
          subtitle="Your personalized biomarkers and trends mapping"
          icon={<Brain color={Colors.primary} size={24} />}
        />

        {/* Diagnostics & Lab Grid */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Diagnostics Laboratory</Text>
        <FeatureGrid features={diagnosticsFeatures} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
});
