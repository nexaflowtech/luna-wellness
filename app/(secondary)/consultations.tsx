import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Star, Video, MessageCircle, Clock, BadgeCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SPECIALTIES = ['All', 'Gynecologist', 'Endocrinologist', 'Dietitian', 'Naturopath'];

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Gynecologist',
    experience: '12 yrs',
    rating: 4.9,
    reviews: 312,
    fee: '₹699',
    available: 'Today, 4:00 PM',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
    verified: true,
    tags: ['PCOS', 'Hormonal Health', 'Fertility'],
  },
  {
    id: '2',
    name: 'Dr. Ananya Rao',
    specialty: 'Endocrinologist',
    experience: '9 yrs',
    rating: 4.8,
    reviews: 218,
    fee: '₹849',
    available: 'Tomorrow, 11:00 AM',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop',
    verified: true,
    tags: ['Thyroid', 'Insulin Resistance', 'Metabolic Health'],
  },
  {
    id: '3',
    name: 'Divya Menon, RD',
    specialty: 'Dietitian',
    experience: '7 yrs',
    rating: 4.7,
    reviews: 184,
    fee: '₹499',
    available: 'Today, 6:30 PM',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format&fit=crop',
    verified: false,
    tags: ['Anti-Inflammatory Diet', 'PCOS Nutrition', 'Weight Loss'],
  },
];

export default function ConsultationsScreen() {
  const [activeSpec, setActiveSpec] = useState('All');

  const filtered = activeSpec === 'All' ? DOCTORS : DOCTORS.filter(d => d.specialty === activeSpec);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[22px] font-black">Consultations</Text>
          <Text className="text-textSecondary text-[13px]">Book verified health specialists</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#00D4FF]/10 items-center justify-center border border-[#00D4FF]/20">
          <Video color="#00D4FF" size={20} />
        </View>
      </View>

      {/* Filters */}
      <View className="py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {SPECIALTIES.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setActiveSpec(s)}
              className="px-5 py-2.5 rounded-full border"
              style={{
                backgroundColor: activeSpec === s ? '#7C3AED20' : 'rgba(255,255,255,0.04)',
                borderColor: activeSpec === s ? '#7C3AED60' : 'rgba(255,255,255,0.08)',
              }}
            >
              <Text className="text-[13px] font-bold" style={{ color: activeSpec === s ? '#7C3AED' : '#8A8A93' }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 16 }} showsVerticalScrollIndicator={false}>
        {filtered.map(doc => (
          <TouchableOpacity
            key={doc.id}
            activeOpacity={0.9}
            onPress={() => router.push('/(secondary)/doctor-booking' as any)}
          >
            <View className="bg-surface border border-white/5 rounded-[32px] p-5">
              {/* Doctor info row */}
              <View className="flex-row gap-4 mb-4">
                <View className="relative">
                  <Image source={{ uri: doc.avatar }} className="w-16 h-16 rounded-[20px]" />
                  {doc.verified && (
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent items-center justify-center border-2 border-background">
                      <BadgeCheck color="white" size={12} />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-white text-[18px] font-black leading-tight">{doc.name}</Text>
                  <Text className="text-textSecondary text-[13px] font-medium mt-0.5">{doc.specialty} · {doc.experience} exp</Text>
                  <View className="flex-row items-center gap-1.5 mt-1.5">
                    <Star color="#EAB308" fill="#EAB308" size={13} />
                    <Text className="text-white text-[13px] font-extrabold">{doc.rating}</Text>
                    <Text className="text-textSecondary text-[12px]">({doc.reviews} reviews)</Text>
                  </View>
                </View>
              </View>

              {/* Tags */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {doc.tags.map(tag => (
                  <View key={tag} className="bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                    <Text className="text-textSecondary text-[11px] font-bold">{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Footer row */}
              <View className="h-[1px] bg-white/5 mb-4" />
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wide mb-0.5">Consultation Fee</Text>
                  <Text className="text-white text-[20px] font-black">{doc.fee}</Text>
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5 mb-2">
                    <Clock color="#22C55E" size={13} />
                    <Text className="text-accent text-[12px] font-bold">{doc.available}</Text>
                  </View>
                  <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="px-5 py-2.5 rounded-full">
                    <Text className="text-white text-[13px] font-black">Book Now</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}
