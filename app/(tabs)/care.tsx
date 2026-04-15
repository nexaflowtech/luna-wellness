import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldAlert, ActivitySquare, HeartPulse, Stethoscope, Microscope, Brain, FileText, Droplets, Apple, ChevronRight, AlertCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { Header } from '@/src/components/ui/Header';

export default function CareScreen() {
  const diagnosticsFeatures = [
    { id: 'blood', title: 'Blood Work', icon: <Droplets color="#F472B6" size={22} />, color: '#F472B6' },
    { id: 'hormonal', title: 'Hormone Map', icon: <HeartPulse color="#7C3AED" size={22} />, color: '#7C3AED' },
    { id: 'gut', title: 'Gut Health', icon: <Apple color="#22C55E" size={22} />, color: '#22C55E' },
    { id: 'reports', title: 'My Reports', icon: <FileText color="#EAB308" size={22} />, color: '#EAB308' },
  ];

  const primaryTrackers = [
    {
      id: 'symptom',
      title: 'Symptom Checker',
      subtitle: 'Log symptoms for AI clinical mapping',
      icon: <ShieldAlert color="#7C3AED" size={24} />,
      color: '#7C3AED',
      badge: '3 tracked this week',
      badgeColor: '#7C3AED',
    },
    {
      id: 'cycle',
      title: 'Cycle Tracker',
      subtitle: 'Algorithm-based ovulation & period prediction',
      icon: <ActivitySquare color="#F472B6" size={24} />,
      color: '#F472B6',
      badge: undefined,
      badgeColor: undefined,
    },
  ];

  const clinicalServices = [
    {
      id: 'doctor',
      title: 'Doctor Consultation',
      subtitle: 'Speak to verified specialists via video',
      icon: <Stethoscope color="#22C55E" size={24} />,
      color: '#22C55E',
      badge: undefined,
      badgeColor: undefined,
    },
    {
      id: 'insights',
      title: 'Health Insights',
      subtitle: 'Your personalised biomarkers and trends',
      icon: <Brain color="#7C3AED" size={24} />,
      color: '#7C3AED',
      badge: undefined,
      badgeColor: undefined,
    },
  ];

  const ServiceCard = ({ item }: { item: typeof primaryTrackers[0] }) => (
    <TouchableOpacity activeOpacity={0.88} className="mb-4">
      <View className="bg-surface border border-white/5 rounded-[28px] p-5 flex-row items-center">
        <View
          className="w-14 h-14 rounded-[20px] items-center justify-center mr-5 border"
          style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }}
        >
          {item.icon}
        </View>
        <View className="flex-1 mr-3">
          <Text className="text-white text-[17px] font-black mb-1 leading-tight">{item.title}</Text>
          <Text className="text-textSecondary text-[13px] leading-snug">{item.subtitle}</Text>
          {item.badge && (
            <View
              className="self-start px-3 py-1 rounded-full mt-2 border"
              style={{ backgroundColor: `${item.badgeColor}15`, borderColor: `${item.badgeColor}40` }}
            >
              <Text className="text-[11px] font-bold" style={{ color: item.badgeColor }}>
                {item.badge}
              </Text>
            </View>
          )}
        </View>
        <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
          <ChevronRight color="#8A8A93" size={16} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <Header title="We Care" subtitle="Your clinical AI ecosystem" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Alert Banner */}
        <View className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-[24px] p-5 mb-6 flex-row items-center gap-4 mt-2">
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
            <AlertCircle color="#7C3AED" size={20} />
          </View>
          <Text className="text-white text-[14px] leading-snug font-semibold flex-1">
            Your hormone analysis is due. Book a blood panel today to stay on track.
          </Text>
        </View>

        {/* Primary Trackers */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-1">
          Primary Trackers
        </Text>
        {primaryTrackers.map(item => <ServiceCard key={item.id} item={item} />)}

        {/* Clinical Services */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-1 mt-4">
          Clinical Services
        </Text>
        {clinicalServices.map(item => <ServiceCard key={item.id} item={item} />)}

        {/* Diagnostics Grid */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mb-4 ml-1 mt-4">
          Diagnostics Lab
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {diagnosticsFeatures.map(f => (
            <TouchableOpacity
              key={f.id}
              activeOpacity={0.88}
              className="w-[48%] bg-surface border border-white/5 rounded-[28px] p-5 items-center"
            >
              <View
                className="w-14 h-14 rounded-[20px] items-center justify-center mb-4 border"
                style={{ backgroundColor: `${f.color}15`, borderColor: `${f.color}30` }}
              >
                {f.icon}
              </View>
              <Text className="text-white text-[15px] font-bold text-center">{f.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Lab Test CTA */}
        <TouchableOpacity activeOpacity={0.9} className="mt-6">
          <LinearGradient
            colors={['#7C3AED', '#F472B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-[28px] p-6 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-4">
              <Text className="text-white text-[20px] font-black mb-1">Book a Lab Test</Text>
              <Text className="text-white/80 text-[13px]">At-home sample collection available.</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center border border-white/30">
              <Microscope color="white" size={24} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}
