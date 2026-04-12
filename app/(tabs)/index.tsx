import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  PlayCircle, 
  Utensils, 
  CheckCircle2, 
  MessageCircle, 
  HeartPulse, 
  CalendarDays, 
  FileText, 
  Apple,
  Activity,
  Droplets,
  Flame
} from 'lucide-react-native';

// NOTE: Add your state management hooks (useAuth, usePlanData) here when connecting API
// import { useAuth } from '@/src/context/AuthContext';

export default function DashboardScreen() {
  // MOCK DATA for layout preview - should connect to global state / Firebase
  const userName = "Luna Member"; // Replace with user.displayName
  const activePlanName = "Zumba + Diet + Coach"; 
  const activePlanDay = "Day 3 / 30";
  const expectedResult = "Lose 5kg in 30 days";

  const features = [
    { id: 'nutrition', title: 'Nutrition AI', icon: <Apple color="#7C3AED" size={24} /> },
    { id: 'diet', title: 'Diet Tracker', icon: <Utensils color="#00D4FF" size={24} /> },
    { id: 'period', title: 'Period Tracker', icon: <CalendarDays color="#7C3AED" size={24} /> },
    { id: 'report', title: 'AI Report', icon: <FileText color="#00D4FF" size={24} /> },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#0A0A0F' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1 — TOP HERO CARD */}
        <View style={styles.section}>
          <Text style={styles.greeting}>Good morning, {userName} 👋</Text>
          
          <View style={styles.activePlanCard}>
            {/* Background Glow */}
            <View style={styles.activePlanGlow} />
            <View style={styles.activePlanContent}>
              <View>
                <Text style={styles.activePlanTitle}>{activePlanName}</Text>
                
                {/* Progress bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
                  <View style={{ height: 6, flex: 1, backgroundColor: '#1A1A2E', borderRadius: 3 }}>
                    <View style={{ width: '10%', height: '100%', backgroundColor: '#7C3AED', borderRadius: 3 }} />
                  </View>
                  <Text style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 'bold', marginLeft: 12 }}>{activePlanDay}</Text>
                </View>

                <Text style={{ color: '#00D4FF', fontSize: 14, fontWeight: '700' }}>{expectedResult}</Text>
              </View>
              
              {/* Avatar / Physique Chip placeholder */}
              <View style={styles.avatarChip}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=100&auto=format&fit=crop' }} style={{ width: '100%', height: '100%' }} />
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 2 — TODAY PLAN */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Today's Plan</Text>
          
          {/* Workout Card */}
          <TouchableOpacity activeOpacity={0.97} style={[styles.taskCard, { borderLeftColor: '#7C3AED', borderLeftWidth: 4 }]}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(124,58,237,0.15)' }]}>
              <PlayCircle color="#7C3AED" size={20} />
            </View>
            <View style={styles.taskTextWrap}>
              <Text style={styles.taskTitle}>Zumba Cardio Burst</Text>
              <Text style={styles.taskSub}>20 min • Burn ~200 kcal</Text>
            </View>
            <View style={styles.taskAction}><Text style={styles.taskActionText}>Start</Text></View>
          </TouchableOpacity>

          {/* Diet Card */}
          <TouchableOpacity activeOpacity={0.97} style={[styles.taskCard, { borderLeftColor: '#10B981', borderLeftWidth: 4 }]}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Utensils color="#10B981" size={20} />
            </View>
            <View style={styles.taskTextWrap}>
              <Text style={styles.taskTitle}>Nutrition Summary</Text>
              <Text style={styles.taskSub}>1400 kcal • 100g Protein</Text>
            </View>
            <View style={styles.taskAction}><Text style={styles.taskActionText}>View</Text></View>
          </TouchableOpacity>

          {/* Habits Card */}
          <TouchableOpacity activeOpacity={0.97} style={[styles.taskCard, { borderLeftColor: '#00D4FF', borderLeftWidth: 4 }]}>
            <View style={[styles.iconWrap, { backgroundColor: 'rgba(0,212,255,0.15)' }]}>
              <Droplets color="#00D4FF" size={20} />
            </View>
            <View style={styles.taskTextWrap}>
              <Text style={styles.taskTitle}>Daily Hydration</Text>
              <Text style={styles.taskSub}>2 / 8 Glasses (0.5L)</Text>
            </View>
            <View style={styles.taskAction}><Text style={styles.taskActionText}>+1</Text></View>
          </TouchableOpacity>
        </View>

        {/* SECTION 3 — TRANSFORMATION PROOF */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Success Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingRight: 24 }}>
            {[1, 2].map((i) => (
              <TouchableOpacity activeOpacity={0.97} key={i} style={styles.proofCard}>
                <Image source={{ uri: `https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop` }} style={styles.proofImg} />
                <View style={styles.proofContentOverlay} />
                <View style={styles.proofContent}>
                  <View style={styles.proofTag}>
                    <Text style={styles.proofTagText}>Lost 8kg with Zumba + Diet</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 4 — DOCTOR CONSULTATION BANNER */}
        <View style={styles.section}>
          <View style={styles.bannerContainer}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Struggling with hormonal issues?</Text>
              <Text style={{ color: '#94A3B8', fontSize: 13, marginBottom: 16 }}>Talk to certified doctors and specialists.</Text>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient colors={['#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>Book a Doctor</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: 'center', opacity: 0.8 }}>
              <HeartPulse color="#00D4FF" size={48} />
            </View>
          </View>
        </View>

        {/* SECTION 5 — FITNESS CLASSES UPSELL */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Explore Classes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingRight: 24, gap: 16 }}>
            {[{ title: 'Zumba Cardio', color: '#7C3AED' }, { title: 'Yoga Flow', color: '#10B981' }, { title: 'HIIT Blast', color: '#00D4FF' }].map((item, idx) => (
              <TouchableOpacity activeOpacity={0.97} key={idx} style={[styles.upsellCard, { borderBottomColor: item.color, borderBottomWidth: 3 }]}>
                <View style={[styles.upsellIconWrap, { backgroundColor: `${item.color}20` }]}>
                  <Flame color={item.color} size={24} />
                </View>
                <Text style={styles.upsellTitle}>{item.title}</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>Premium Plan</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 6 — AI COACH */}
        <View style={styles.section}>
          <LinearGradient colors={['#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 1, borderRadius: 25 }}>
            <View style={styles.aiCardInner}>
              <View style={styles.aiIconWrap}>
                <MessageCircle color="#00D4FF" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' }}>Ask Eva, your AI Coach</Text>
                <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 2 }}>Diet • Workout • Doubts</Text>
              </View>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient colors={['#7C3AED', '#00D4FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }}>
                  <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>Chat</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* SECTION 7 — FEATURES GRID */}
        <View style={[styles.section, { marginBottom: 0 }]}>
          <Text style={styles.sectionHeading}>Quick Trackers</Text>
          <View style={styles.featuresGrid}>
            {features.map(f => (
              <TouchableOpacity activeOpacity={0.97} key={f.id} style={styles.featureCard}>
                <View style={styles.featureIconWrap}>
                  {f.icon}
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeading: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  activePlanCard: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#7C3AED',
    padding: 20,
  },
  activePlanGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(124,58,237,0.1)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  activePlanContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  activePlanTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
    maxWidth: 200,
  },
  avatarChip: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: '#00D4FF',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  taskTextWrap: {
    flex: 1,
  },
  taskTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  taskAction: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  taskActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  proofCard: {
    width: 280,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  proofImg: {
    width: '100%',
    height: '100%',
  },
  proofContentOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  proofContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  proofTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  proofTagText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bannerContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00D4FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upsellCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  upsellIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  upsellTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
  },
  aiCardInner: {
    backgroundColor: '#0A0A0F',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,212,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureIconWrap: {
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 16,
  },
  featureTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
});
