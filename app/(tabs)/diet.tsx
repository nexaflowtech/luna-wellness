import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontWeight } from '@/src/constants/theme';
import { ProgressBar } from '@/src/components/atoms/ProgressBar';
import { Card } from '@/src/components/molecules/Card';

const MEALS = [
  { id: '1', time: '7:30 AM', meal: 'Breakfast', items: 'Oats + Banana + Almond milk', kcal: 380, done: true },
  { id: '2', time: '1:00 PM', meal: 'Lunch', items: 'Quinoa bowl + Grilled tofu + Salad', kcal: 620, done: true },
  { id: '3', time: '8:00 PM', meal: 'Dinner', items: 'Lentil soup + Brown rice + Veggies', kcal: 510, done: false },
];

export default function DietScreen() {
  const consumed = 1000;
  const goal = 2000;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#6e5d00', '#c7aa00']} style={styles.header}>
        <Text style={styles.title}>Diet</Text>
        <Text style={styles.subtitle}>Your personalized meal plan</Text>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Calories today</Text>
          <Text style={styles.cardValue}>{consumed} / {goal}</Text>
          <ProgressBar value={(consumed / goal) * 100} color="#b7004e" />
        </Card>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {MEALS.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => router.push('/(secondary)/meal-detail' as any)}>
            <Card style={m.done ? { ...styles.mealCard, opacity: 0.75 } : styles.mealCard}>
              <Text style={styles.time}>{m.time}</Text>
              <Text style={styles.mealName}>{m.meal}</Text>
              <Text style={styles.mealItems}>{m.items}</Text>
              <Text style={styles.kcal}>🔥 {m.kcal} kcal</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  card: { marginTop: 16 },
  cardLabel: { fontSize: 12, color: '#5b3f44' },
  cardValue: { fontSize: 24, fontWeight: FontWeight.bold, color: '#181b27', marginVertical: 4 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  mealCard: { gap: 6 },
  time: { fontSize: 12, color: '#8f6f74' },
  mealName: { fontSize: 16, fontWeight: FontWeight.bold, color: '#181b27' },
  mealItems: { fontSize: 13, color: '#5b3f44' },
  kcal: { fontSize: 12, color: '#b7004e', fontWeight: FontWeight.semibold },
});
