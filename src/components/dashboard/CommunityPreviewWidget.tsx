import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Shadow, FontWeight } from '@/constants/theme';
import { Card } from '@/components/molecules/Card';
import { Avatar } from '@/components/atoms/Avatar';

export function CommunityPreviewWidget() {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending in Community 🌍</Text>
      </View>
      
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <Avatar name="Rohan Mehta" size="sm" />
          <View style={{ flex: 1 }}>
            <Text style={styles.author}>Rohan Mehta</Text>
            <Text style={styles.meta}>Pro Member • 1 hr ago</Text>
          </View>
        </View>
        <Text style={styles.content} numberOfLines={2}>
          Hit a new PR on deadlifts today — 120 kg! The Luna strength program is an absolute game changer...
        </Text>
        <View style={styles.actions}>
          <Text style={styles.actionText}>❤️ 89 Likes</Text>
          <Text style={styles.actionText}>💬 12 Comments</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Join Discussion</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, ...Shadow.sm },
  header: { marginBottom: 2 },
  title: { fontSize: 16, fontWeight: FontWeight.bold, color: Colors.text },
  post: { backgroundColor: Colors.background, padding: 14, borderRadius: Radius.xl, gap: 10 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  author: { fontSize: 14, fontWeight: FontWeight.bold, color: Colors.text },
  meta: { fontSize: 11, color: Colors.textMuted },
  content: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 4 },
  actionText: { fontSize: 12, color: Colors.textMuted, fontWeight: FontWeight.medium },
  btn: { alignItems: 'center', paddingTop: 8 },
  btnText: { fontSize: 14, color: Colors.primary, fontWeight: FontWeight.semibold },
});
