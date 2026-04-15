import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { addDoc, collection, getDocs, increment, limit, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/src/config/firebase';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react-native';

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
    try {
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
    } catch(e) {
      // ignore
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const seedPost = async () => {
    try {
      await addDoc(collection(db, 'communityPosts'), {
        authorName: 'You',
        content: 'Just smashed my daily step goal and feeling amazing! 🌟',
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      await loadPosts();
    } catch(e) {
      // ignore
    }
  };

  const likePost = async (id: string) => {
    try {
      await updateDoc(doc(db, 'communityPosts', id), { likesCount: increment(1) });
      await loadPosts();
    } catch(e) {
      // ignore
    }
  };

  // Helper for generating deterministic avatar colors based on name
  const getAvatarColor = (name: string) => {
    const colors = ['#7C3AED', '#F472B6', '#22C55E', '#00D4FF', '#EAB308'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <ScreenWrapper>
      <Header title="Community" subtitle="Connect with the Luna tribe" />

      <View className="mb-6 mt-2">
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest px-5 mb-3">Trending Challenges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {CHALLENGES.map((c) => (
            <View key={c} className="px-5 py-3 rounded-full bg-surface border border-white/5 flex-row items-center gap-2">
              <Text className="text-[14px]">🏆</Text>
              <Text className="text-textPrimary text-[13px] font-bold">{c}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity activeOpacity={0.9} onPress={seedPost}>
          <View className="bg-primary/10 border border-primary/30 p-5 rounded-[24px] flex-row items-center gap-4">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-primary font-bold">Y</Text>
            </View>
            <Text className="text-primary font-bold flex-1">Share your wellness update...</Text>
          </View>
        </TouchableOpacity>

        {posts.map((p) => {
          const color = getAvatarColor(p.authorName);
          return (
            <View key={p.id} className="bg-surface border border-white/5 p-5 rounded-[32px]">
              
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-[16px] items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <Text style={{ color, fontWeight: '900', fontSize: 18 }}>{p.authorName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="text-white font-bold text-[16px]">{p.authorName}</Text>
                    <Text className="text-textSecondary text-[12px] font-medium mt-0.5">2 hours ago</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-8 h-8 items-center justify-center rounded-full bg-white/5">
                  <MoreHorizontal color="#8A8A93" size={16} />
                </TouchableOpacity>
              </View>

              <Text className="text-white text-[15px] mb-5 leading-6">{p.content}</Text>
              
              <View className="h-[1px] bg-white/5 mb-4" />

              <View className="flex-row items-center gap-6 px-1">
                <TouchableOpacity activeOpacity={0.8} onPress={() => likePost(p.id)} className="flex-row items-center gap-2">
                  <Heart color={p.likesCount > 0 ? '#F472B6' : '#8A8A93'} size={20} fill={p.likesCount > 0 ? '#F472B6' : 'transparent'} />
                  <Text className={`font-bold ${p.likesCount > 0 ? 'text-[#F472B6]' : 'text-textSecondary'}`}>{p.likesCount}</Text>
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                  <MessageCircle color="#8A8A93" size={20} />
                  <Text className="text-textSecondary font-bold">{p.commentsCount}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScreenWrapper>
  );
}
