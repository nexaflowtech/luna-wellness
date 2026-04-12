import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors } from '@/constants/theme';
import { CategoryGrid } from '@/components/explore/CategoryGrid';
import { PlanCard } from '@/components/explore/PlanCard';
import { Carousel } from '@/components/dashboard/Carousel';
import { Activity, Apple, Stethoscope, PlayCircle, Star, Sparkles } from 'lucide-react-native';

export default function ExploreScreen() {
  const labCategories = [
    { id: 'blood', title: 'Blood Tests', icon: <Activity color={Colors.accent} size={20} />, color: 'rgba(236,72,153,0.1)' },
    { id: 'hormone', title: 'Hormone Panel', icon: <Stethoscope color={Colors.primary} size={20} />, color: 'rgba(124,58,237,0.1)' },
    { id: 'dietian', title: 'Consult Dietitian', icon: <Apple color={Colors.success} size={20} />, color: 'rgba(16,185,129,0.1)' },
    { id: 'features', title: 'Luna Premium', icon: <Sparkles color={Colors.warning} size={20} />, color: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#ffffff' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover personalized health plans and classes.</Text>
        </View>

        {/* Health Plans Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Targeted Health Plans</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <Carousel>
          <PlanCard 
            title="PCOS Recovery" 
            subtitle="12 Weeks • Nutrition + Wellness"
            imageUri="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop"
          />
          <PlanCard 
            title="Pregnancy Fitness" 
            subtitle="Trimester mapped exercises"
            imageUri="https://images.unsplash.com/photo-1518608241477-987820ebfaef?q=80&w=400&auto=format&fit=crop"
          />
        </Carousel>

        {/* Lab Tests */}
        <Text style={styles.sectionTitle}>Lab Tests & Consultations</Text>
        <CategoryGrid categories={labCategories} />

        {/* Free Trial Banner */}
        <TouchableOpacity style={styles.trialBanner} activeOpacity={0.9}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.trialImg}
            imageStyle={{ borderRadius: 24, opacity: 0.8 }}
          >
            <View style={styles.trialOverlay}>
              <View style={styles.badge}><Text style={styles.badgeText}>7 DAYS FREE</Text></View>
              <Text style={styles.trialTitle}>Unlock Premium Classes</Text>
              <Text style={styles.trialSub}>Access all live programs and AI tracking.</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* All Classes Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Classes</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <Carousel>
          <PlanCard 
            title="Zumba Cardio Blast" 
            subtitle="45 Mins • High Intensity"
            imageUri="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
          />
          <PlanCard 
            title="Morning Flow Yoga" 
            subtitle="30 Mins • Recovery"
            imageUri="https://images.unsplash.com/photo-1599901860904-17e08c3d0cb4?q=80&w=400&auto=format&fit=crop"
          />
          <PlanCard 
            title="HIIT Core Crusher" 
            subtitle="20 Mins • Intense"
            imageUri="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop"
          />
        </Carousel>

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
    marginBottom: 24,
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  trialBanner: {
    height: 180,
    borderRadius: 24,
    marginBottom: 32,
    backgroundColor: '#000',
    shadowColor: '#181b27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  trialImg: {
    flex: 1,
    justifyContent: 'center',
  },
  trialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  trialTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  trialSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
});
