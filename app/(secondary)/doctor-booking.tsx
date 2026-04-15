import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, Star, Video, Clock, BadgeCheck, Calendar, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TIMES = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '5:30 PM', '7:00 PM'];
const DATES = [
  { day: 'Mon', date: '14', available: true },
  { day: 'Tue', date: '15', available: true },
  { day: 'Wed', date: '16', available: false },
  { day: 'Thu', date: '17', available: true },
  { day: 'Fri', date: '18', available: true },
];

export default function DoctorBookingScreen() {
  const [selectedDate, setSelectedDate] = useState('15');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text className="text-white text-[22px] font-black flex-1">Book Consultation</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 20 }} showsVerticalScrollIndicator={false}>

        {/* Doctor Card */}
        <View className="bg-surface border border-white/5 rounded-[32px] p-5 flex-row gap-4 mt-2">
          <View className="relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' }}
              className="w-20 h-20 rounded-[22px]"
            />
            <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent items-center justify-center border-2 border-background">
              <BadgeCheck color="white" size={12} />
            </View>
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-white text-[19px] font-black mb-0.5">Dr. Priya Sharma</Text>
            <Text className="text-textSecondary text-[13px] mb-2">Gynecologist · 12 yrs experience</Text>
            <View className="flex-row items-center gap-1.5">
              <Star color="#EAB308" fill="#EAB308" size={14} />
              <Text className="text-white font-extrabold text-[13px]">4.9</Text>
              <Text className="text-textSecondary text-[12px]">(312 reviews)</Text>
            </View>
          </View>
        </View>

        {/* Consultation Type */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Consultation Type</Text>
          <View className="flex-row gap-4">
            {[
              { label: 'Video Call', icon: <Video color="#7C3AED" size={22} />, color: '#7C3AED', active: true },
              { label: 'Chat', icon: <ChevronRight color="#8A8A93" size={22} />, color: '#8A8A93', active: false },
            ].map(t => (
              <View
                key={t.label}
                className="flex-1 rounded-[22px] p-4 border items-center gap-2"
                style={{
                  backgroundColor: t.active ? '#7C3AED15' : 'rgba(255,255,255,0.04)',
                  borderColor: t.active ? '#7C3AED50' : 'rgba(255,255,255,0.08)',
                }}
              >
                {t.icon}
                <Text className="font-bold text-[13px]" style={{ color: t.active ? '#7C3AED' : '#8A8A93' }}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Date Selector */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Select Date</Text>
            <View className="flex-row items-center gap-1">
              <Calendar color="#7C3AED" size={14} />
              <Text className="text-primary text-[12px] font-bold">April 2026</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            {DATES.map(d => (
              <TouchableOpacity
                key={d.date}
                onPress={() => d.available && setSelectedDate(d.date)}
                disabled={!d.available}
                className="flex-1 h-[70px] rounded-[20px] items-center justify-center border"
                style={{
                  backgroundColor: selectedDate === d.date ? '#7C3AED' : d.available ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  borderColor: selectedDate === d.date ? '#7C3AED' : 'rgba(255,255,255,0.08)',
                  opacity: d.available ? 1 : 0.35,
                }}
              >
                <Text className="text-[11px] font-bold uppercase mb-1" style={{ color: selectedDate === d.date ? 'white' : '#8A8A93' }}>{d.day}</Text>
                <Text className="text-[20px] font-black" style={{ color: selectedDate === d.date ? 'white' : 'white' }}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selector */}
        <View>
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4">Select Time</Text>
          <View className="flex-row flex-wrap gap-3">
            {TIMES.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedTime(t)}
                className="px-4 py-2.5 rounded-[14px] border flex-row items-center gap-2"
                style={{
                  backgroundColor: selectedTime === t ? '#7C3AED20' : 'rgba(255,255,255,0.04)',
                  borderColor: selectedTime === t ? '#7C3AED60' : 'rgba(255,255,255,0.08)',
                }}
              >
                <Clock color={selectedTime === t ? '#7C3AED' : '#8A8A93'} size={13} />
                <Text className="text-[13px] font-bold" style={{ color: selectedTime === t ? '#7C3AED' : '#8A8A93' }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fee Summary */}
        <View className="bg-surface border border-white/5 rounded-[28px] p-5 gap-3">
          <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest">Booking Summary</Text>
          {[
            { label: 'Consultation Fee', value: '₹699' },
            { label: 'Platform Fee', value: '₹49' },
            { label: 'Discount', value: '−₹100' },
          ].map(r => (
            <View key={r.label} className="flex-row justify-between">
              <Text className="text-textSecondary text-[14px]">{r.label}</Text>
              <Text className={`font-bold text-[14px] ${r.label === 'Discount' ? 'text-accent' : 'text-white'}`}>{r.value}</Text>
            </View>
          ))}
          <View className="h-[1px] bg-white/10" />
          <View className="flex-row justify-between">
            <Text className="text-white text-[16px] font-black">Total</Text>
            <Text className="text-white text-[20px] font-black">₹648</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Confirm CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-background border-t border-white/5">
        <TouchableOpacity
          activeOpacity={selectedTime ? 0.9 : 0.5}
          style={{ opacity: selectedTime ? 1 : 0.45 }}
          onPress={() => selectedTime && router.back()}
        >
          <LinearGradient colors={['#7C3AED', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-[20px] py-5 items-center">
            <Text className="text-white font-black text-[17px]">
              {selectedTime ? `Confirm for ${selectedTime}` : 'Select a Time Slot'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
