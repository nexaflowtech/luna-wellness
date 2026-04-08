import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

const PLANS = [
  {
    id: 'transform',
    emoji: '🔥',
    title: 'Total Transform',
    match: '97% match',
    gradient: Colors.gradPrimary,
    tags: ['Weight Loss', 'Strength', 'Nutrition'],
    duration: '12 weeks',
    sessions: '5x / week',
    desc: 'A high-intensity program combining HIIT, strength training and personalised meal plans to maximise fat loss and muscle gain.',
    recommended: true,
  },
  {
    id: 'balance',
    emoji: '🧘',
    title: 'Mindful Balance',
    match: '82% match',
    gradient: Colors.gradOcean,
    tags: ['Stress Relief', 'Flexibility', 'Sleep'],
    duration: '8 weeks',
    sessions: '3x / week',
    desc: 'Yoga, breathwork and mindfulness sessions designed to reduce cortisol, improve mobility and enhance sleep quality.',
    recommended: false,
  },
  {
    id: 'lean',
    emoji: '🥗',
    title: 'Clean & Lean',
    match: '74% match',
    gradient: Colors.gradForest,
    tags: ['Nutrition', 'Low Impact', 'Detox'],
    duration: '6 weeks',
    sessions: '4x / week',
    desc: 'Nutrition-first approach with gentle home workouts for sustainable, long-lasting lifestyle transformation.',
    recommended: false,
  },
];

export default function ProgramRecommendation() {
  const [selected, setSelected] = useState('transform');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: Colors.text }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Your Programs 🎯</Text>
          <Text style={styles.subtitle}>AI-matched to your goals and lifestyle</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} onPress={() => setSelected(plan.id)} activeOpacity={0.9}>
            <View style={[styles.card, selected === plan.id && styles.cardSelected]}>
              {plan.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>⭐ RECOMMENDED</Text>
                </View>
              )}

              <LinearGradient
                colors={plan.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardGradientBar}
              >
                <Text style={styles.cardEmoji}>{plan.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{plan.title}</Text>
                  <Text style={styles.cardMatch}>{plan.match}</Text>
                </View>
                {selected === plan.id && (
                  <View style={styles.selectCheck}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>
                  </View>
                )}
              </LinearGradient>

              <View style={styles.cardBody}>
                {/* Tags */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {plan.tags.map((t) => (
                    <Badge key={t} label={t} variant="primary" />
                  ))}
                </View>

                {/* Meta */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>⏱</Text>
                    <Text style={styles.metaLabel}>{plan.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>📅</Text>
                    <Text style={styles.metaLabel}>{plan.sessions}</Text>
                  </View>
                </View>

                <Text style={styles.desc}>{plan.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Button
          label="Start This Program →"
          onPress={() => router.push('/(setup)/subscription')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.md,
  },
  cardSelected: { borderColor: Colors.primary },
  recommendedBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  recommendedText: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.warning, letterSpacing: 1 },
  cardGradientBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: '#fff' },
  cardMatch: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  selectCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 18, gap: 12 },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { fontSize: 14 },
  metaLabel: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  desc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
});
