import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadow, Radius, FontWeight } from '@/constants/theme';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/molecules/Card';

const POSTS = [
  {
    id: '1',
    author: 'Priya Kapoor',
    role: 'Yoga Instructor',
    time: '2 min ago',
    content: 'Just completed my 30-day yoga streak! 🎉 Feeling incredible — consistency really is everything. Here\'s what changed for me...',
    image: null,
    likes: 142,
    comments: 18,
    emoji: '🧘‍♀️',
    tag: 'Yoga',
  },
  {
    id: '2',
    author: 'Rohan Mehta',
    role: 'Pro Member',
    time: '1 hr ago',
    content: 'Hit a new PR on deadlifts today — 120 kg! The Luna strength program is an absolute game changer. Week 6 and I\'m already seeing serious results 🔥',
    likes: 89,
    comments: 12,
    emoji: '🏋️',
    tag: 'Strength',
  },
  {
    id: '3',
    author: 'Sneha Tiwari',
    role: 'Nutritionist',
    time: '3 hrs ago',
    content: 'This week\'s meal prep sorted! 🥗 Sharing my balanced 1,800 kcal plan in the comments below. Proof that eating healthy doesn\'t have to be boring!',
    likes: 204,
    comments: 47,
    emoji: '👩‍🍳',
    tag: 'Nutrition',
  },
  {
    id: '4',
    author: 'Arjun Nair',
    role: 'Pro Member',
    time: '5 hrs ago',
    content: 'Morning run done ✅  5 km in 27:30 minutes. Breathing feels way better after adding the breathwork sessions to my routine.',
    likes: 56,
    comments: 8,
    emoji: '🏃',
    tag: 'Cardio',
  },
];

const TAG_COLORS: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
  Yoga: 'info', Strength: 'primary', Nutrition: 'success', Cardio: 'warning',
};

export default function CommunityFeed() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.gradOcean} style={styles.header}>
        <Text style={styles.title}>Community 🌍</Text>
        <Text style={styles.subtitle}>Connect, share & inspire each other</Text>
      </LinearGradient>

      {/* Trending tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
        {['All', 'Yoga', 'Strength', 'Nutrition', 'Cardio', 'Mindfulness'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tag, t === 'All' && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
          >
            <Text style={[styles.tagText, t === 'All' && { color: '#fff' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create post prompt */}
        <TouchableOpacity style={styles.createPost} activeOpacity={0.88}>
          <Avatar name="You" size="sm" />
          <Text style={styles.createPostText}>Share your wellness journey...</Text>
        </TouchableOpacity>

        {/* Posts */}
        {POSTS.map((p) => (
          <Card key={p.id} style={styles.postCard}>
            {/* Author row */}
            <View style={styles.postHeader}>
              <Avatar name={p.author} size="sm" />
              <View style={{ flex: 1 }}>
                <Text style={styles.authorName}>{p.author}</Text>
                <Text style={styles.authorMeta}>{p.role} · {p.time}</Text>
              </View>
              <Badge label={p.tag} variant={TAG_COLORS[p.tag] ?? 'neutral'} />
            </View>

            <Text style={styles.postContent}>{p.content}</Text>

            {/* Actions */}
            <View style={styles.postFooter}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>❤️</Text>
                <Text style={styles.actionCount}>{p.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionCount}>{p.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>↗️</Text>
                <Text style={styles.actionCount}>Share</Text>
              </TouchableOpacity>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  tags: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 14 },
  createPost: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  createPostText: { fontSize: 14, color: Colors.textMuted },
  postCard: { gap: 14 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authorName: { fontSize: 14, fontWeight: FontWeight.semibold, color: Colors.text },
  authorMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  postContent: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  postFooter: { flexDirection: 'row', gap: 20, paddingTop: 4, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 16 },
  actionCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: FontWeight.medium },
});
