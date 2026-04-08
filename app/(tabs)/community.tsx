import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, getDocs, increment, limit, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { Colors, FontWeight, Radius } from '@/src/constants/theme';
import { Card } from '@/src/components/molecules/Card';

type CommunityPost = {
  id: string;
  authorName: string;
  content: string;
  likesCount: number;
  commentsCount: number;
};

const CHALLENGES = ['7-Day Hydration', '10K Steps Daily', 'Sleep Before 11 PM'];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const loadPosts = async () => {
    const q = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc'), limit(10));
    const snap = await getDocs(q);
    setPosts(
      snap.docs.map((d) => ({
        id: d.id,
        authorName: String(d.data().authorName ?? 'Luna Member'),
        content: String(d.data().content ?? ''),
        likesCount: Number(d.data().likesCount ?? 0),
        commentsCount: Number(d.data().commentsCount ?? 0),
      }))
    );
  };

  useEffect(() => {
    loadPosts().catch(() => setPosts([]));
  }, []);

  const seedPost = async () => {
    await addDoc(collection(db, 'communityPosts'), {
      authorName: 'You',
      content: 'Starting my Luna wellness challenge today.',
      likesCount: 0,
      commentsCount: 0,
      createdAt: serverTimestamp(),
    });
    await loadPosts();
  };

  const likePost = async (id: string) => {
    await updateDoc(doc(db, 'communityPosts', id), { likesCount: increment(1) });
    await loadPosts();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#b7004e', '#fc695d']} style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Posts, comments, likes and challenges</Text>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.challenges}>
        {CHALLENGES.map((c) => (
          <View key={c} style={styles.challengeChip}>
            <Text style={styles.challengeText}>🏆 {c}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={seedPost}>
          <Card>
            <Text style={{ color: '#5b3f44' }}>Share your wellness update...</Text>
          </Card>
        </TouchableOpacity>

        {posts.map((p) => (
          <Card key={p.id} style={{ gap: 8 }}>
            <Text style={{ color: '#181b27', fontWeight: FontWeight.bold }}>{p.authorName}</Text>
            <Text style={{ color: '#5b3f44' }}>{p.content}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => likePost(p.id)}>
                <Text style={styles.action}>❤️ {p.likesCount}</Text>
              </TouchableOpacity>
              <Text style={styles.action}>💬 {p.commentsCount}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { fontSize: 26, fontWeight: FontWeight.extrabold, color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  challenges: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  challengeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4bdc3' },
  challengeText: { color: '#5b3f44', fontWeight: FontWeight.medium, fontSize: 13 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 16 },
  action: { color: '#8f6f74', fontWeight: FontWeight.medium },
});
