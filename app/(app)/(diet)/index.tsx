import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Card } from '@/components/molecules/Card';
import { StatCard } from '@/components/molecules/StatCard';

const MEALS = [
  { id: '1', time: '7:30 AM', meal: 'Breakfast', items: 'Oats + Banana + Almond milk', kcal: 380, macros: { p: 12, c: 68, f: 8 }, done: true, emoji: '🥣' },
  { id: '2', time: '1:00 PM', meal: 'Lunch', items: 'Quinoa bowl + Grilled chicken + Green salad', kcal: 620, macros: { p: 46, c: 72, f: 14 }, done: true, emoji: '🍱' },
  { id: '3', time: '4:00 PM', meal: 'Snack', items: 'Greek yogurt + Walnuts + Berries', kcal: 230, macros: { p: 18, c: 24, f: 10 }, done: false, emoji: '🍓' },
  { id: '4', time: '8:00 PM', meal: 'Dinner', items: 'Lentil soup + Brown rice + Steamed veggies', kcal: 510, macros: { p: 22, c: 88, f: 8 }, done: false, emoji: '🍛' },
];

export default function DietPlanner() {
  const consumed = 1000;
  const goal = 2000;
  const pct = (consumed / goal) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradForest} style={styles.header}>
        <Text style={styles.title}>Diet Planner 🥗</Text>
        <Text style={styles.subtitle}>Sunday, 30 March</Text>

        {/* Calorie ring summary */}
        <Card style={styles.calorieCard} padded={false}>
          <View style={styles.calorieInner}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={styles.calorieLabel}>Calories today</Text>
              <View style={styles.calorieValues}>
                <Text style={styles.calorieEaten}>{consumed}</Text>
                <Text style={styles.calorieMax}> / {goal} kcal</Text>
              </View>
              <ProgressBar value={pct} color={Colors.success} trackColor={Colors.successLight} />
              <Text style={styles.calorieRemaining}>{goal - consumed} kcal remaining</Text>
            </View>

            {/* Macros */}
            <View style={styles.macros}>
              {[
                { label: 'Protein', value: '98g', color: Colors.info },
                { label: 'Carbs', value: '252g', color: Colors.warning },
                { label: 'Fat', value: '40g', color: Colors.rose },
              ].map((m) => (
                <View key={m.label} style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Meal Schedule</Text>
        {MEALS.map((m) => (
          <Card key={m.id} style={[styles.mealCard, m.done && styles.mealCardDone]} padded={false}>
            <View style={styles.mealInner}>
              <View style={styles.mealLeft}>
                <Text style={styles.mealTime}>{m.time}</Text>
                <View style={[styles.mealStatus, { backgroundColor: m.done ? Colors.successLight : Colors.borderLight }]}>
                  <Text style={{ fontSize: 10 }}>{m.done ? '✓' : '○'}</Text>
                </View>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.mealTop}>
                  <Text style={styles.mealEmo}>{m.emoji}</Text>
                  <Text style={styles.mealName}>{m.meal}</Text>
                </View>
                <Text style={styles.mealItems}>{m.items}</Text>
                <View style={styles.mealFooter}>
                  <Text style={styles.mealKcal}>🔥 {m.kcal} kcal</Text>
                  <Text style={styles.mealMacros}>P:{m.macros.p}g  C:{m.macros.c}g  F:{m.macros.f}g</Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 4,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  calorieCard: { marginTop: 16, borderRadius: 20 },
  calorieInner: { padding: 18, flexDirection: 'row', gap: 16 },
  calorieLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  calorieValues: { flexDirection: 'row', alignItems: 'flex-end' },
  calorieEaten: { fontSize: 26, fontWeight: FontWeight.bold, color: Colors.text },
  calorieMax: { fontSize: 14, color: Colors.textMuted, paddingBottom: 2 },
  calorieRemaining: { fontSize: 12, color: Colors.success, fontWeight: FontWeight.medium },
  macros: { gap: 12, justifyContent: 'center' },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 15, fontWeight: FontWeight.bold },
  macroLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: FontWeight.medium },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  sectionTitle: { fontSize: 17, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  mealCard: { borderRadius: 20 },
  mealCardDone: { opacity: 0.75 },
  mealInner: { flexDirection: 'row', padding: 16, gap: 14 },
  mealLeft: { alignItems: 'center', gap: 8, width: 52 },
  mealTime: { fontSize: 11, fontWeight: FontWeight.medium, color: Colors.textMuted },
  mealStatus: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mealTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mealEmo: { fontSize: 18 },
  mealName: { fontSize: 15, fontWeight: FontWeight.semibold, color: Colors.text },
  mealItems: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  mealFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealKcal: { fontSize: 12, color: Colors.warning, fontWeight: FontWeight.semibold },
  mealMacros: { fontSize: 11, color: Colors.textMuted },
});
