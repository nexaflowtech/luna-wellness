import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXPERTS = [
  {
    id: '1',
    name: 'Dr. Ananya Sharma',
    role: 'Chief Nutritionist',
    exp: '12 yrs',
    rating: 4.9,
    reviews: 847,
    next: 'Today, 4:00 PM',
    fee: '₹599',
    tags: ['Nutrition', 'Weight Loss', 'PCOS'],
    available: true,
  },
  {
    id: '2',
    name: 'Vikram Iyer',
    role: 'Certified Fitness Trainer',
    exp: '8 yrs',
    rating: 4.8,
    reviews: 612,
    next: 'Tomorrow, 9:00 AM',
    fee: '₹499',
    tags: ['Strength', 'Hypertrophy', 'Sports'],
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Meera Nair',
    role: 'Wellness & Lifestyle Doctor',
    exp: '15 yrs',
    rating: 5.0,
    reviews: 1203,
    next: 'Today, 6:30 PM',
    fee: '₹799',
    tags: ['Lifestyle', 'Stress', 'Hormones'],
    available: true,
  },
  {
    id: '4',
    name: 'Roshan Kulkarni',
    role: 'Sports Physiotherapist',
    exp: '10 yrs',
    rating: 4.7,
    reviews: 389,
    next: 'Wed, 10:00 AM',
    fee: '₹649',
    tags: ['Recovery', 'Injury', 'Mobility'],
    available: false,
  },
];

export default function ConsultationBooking() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradSunrise} style={[styles.header, { paddingTop: Math.max(insets.top + 16, 56) }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Book a Consultation 👨‍⚕️</Text>
        </View>
        <Text style={styles.subtitle}>Speak with certified wellness experts</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {EXPERTS.map((e) => (
          <View key={e.id} style={styles.card}>
            {/* Expert header */}
            <View style={styles.expertHeader}>
              <Avatar name={e.name} size="lg" />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.expertName}>{e.name}</Text>
                  {e.available && <Badge label="Available" variant="success" dot />}
                </View>
                <Text style={styles.expertRole}>{e.role}</Text>
                <Text style={styles.expertExp}>🏅 {e.exp} experience</Text>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStars}>{'⭐'.repeat(5)}</Text>
              <Text style={styles.ratingVal}>{e.rating}</Text>
              <Text style={styles.ratingCount}>({e.reviews.toLocaleString()} reviews)</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagRow}>
              {e.tags.map((t) => (
                <Badge key={t} label={t} variant="primary" />
              ))}
            </View>

            {/* Booking row */}
            <View style={styles.bookRow}>
              <View>
                <Text style={styles.feeLabel}>Consultation fee</Text>
                <Text style={styles.feeValue}>{e.fee} / session</Text>
                <Text style={styles.nextSlot}>🗓 {e.next}</Text>
              </View>
              <Button
                label="Book Now"
                size="sm"
                fullWidth={false}
                onPress={() => {}}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 8,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: FontWeight.extrabold, color: '#fff', flex: 1 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    ...Shadow.md,
  },
  expertHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  expertName: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.text },
  expertRole: { fontSize: 13, color: Colors.primary, fontWeight: FontWeight.medium },
  expertExp: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingStars: { fontSize: 12 },
  ratingVal: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.text },
  ratingCount: { fontSize: 12, color: Colors.textMuted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feeLabel: { fontSize: 12, color: Colors.textMuted },
  feeValue: { fontSize: 17, fontWeight: FontWeight.bold, color: Colors.text },
  nextSlot: { fontSize: 12, color: Colors.success, fontWeight: FontWeight.medium, marginTop: 2 },
});
