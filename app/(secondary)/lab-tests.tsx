import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/src/components/ui/ScreenWrapper';
import { router } from 'expo-router';
import { ChevronLeft, FlaskConical, Clock, CheckCircle2, Package, Home } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TESTS = [
  {
    id: '1',
    name: 'Thyroid Profile',
    price: '₹899',
    originalPrice: '₹1,299',
    description: 'Comprehensive TSH, T3, T4 evaluation with free home collection.',
    duration: '24 hrs',
    params: 6,
    popular: false,
    color: '#7C3AED',
    includes: ['TSH', 'Free T3', 'Free T4', 'Anti-TPO', 'T3 Total', 'T4 Total'],
  },
  {
    id: '2',
    name: 'PCOS Hormone Panel',
    price: '₹1,499',
    originalPrice: '₹2,100',
    description: 'Full PCOS diagnostic — LH, FSH, AMH, testosterone, androgen markers.',
    duration: '48 hrs',
    params: 12,
    popular: true,
    color: '#F472B6',
    includes: ['LH', 'FSH', 'AMH', 'Testosterone', 'Prolactin', 'DHEA-S', 'Androstenedione', '+ 5 more'],
  },
  {
    id: '3',
    name: 'Metabolic Health Check',
    price: '₹1,099',
    originalPrice: '₹1,599',
    description: 'Blood glucose, insulin resistance, lipid panel and liver enzymes.',
    duration: '24 hrs',
    params: 9,
    popular: false,
    color: '#22C55E',
    includes: ['Fasting Glucose', 'HbA1c', 'Insulin', 'Cholesterol', 'Triglycerides', 'HDL', 'LDL', 'ALT', 'AST'],
  },
];

export default function LabTestsScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2 gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/5 items-center justify-center">
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-[22px] font-black">Lab Tests</Text>
          <Text className="text-textSecondary text-[13px]">Book certified hormone & wellness panels</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center border border-accent/20">
          <FlaskConical color="#22C55E" size={20} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 16 }} showsVerticalScrollIndicator={false}>

        {/* Info Banner */}
        <View className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-[24px] p-5 flex-row items-center gap-4 mt-2">
          <View className="w-10 h-10 rounded-full bg-[#00D4FF]/20 items-center justify-center">
            <Home color="#00D4FF" size={18} />
          </View>
          <Text className="text-white text-[13px] font-semibold flex-1 leading-snug">
            Free home sample collection with all packages. Results delivered within 24–48 hours.
          </Text>
        </View>

        {/* Test Package Cards */}
        <Text className="text-textSecondary text-[13px] font-bold uppercase tracking-widest mt-2">Choose a Package</Text>

        {TESTS.map(test => {
          const isSelected = selected === test.id;
          return (
            <TouchableOpacity key={test.id} activeOpacity={0.9} onPress={() => setSelected(isSelected ? null : test.id)}>
              <View
                className="rounded-[32px] border overflow-hidden"
                style={{
                  borderColor: isSelected ? `${test.color}60` : 'rgba(255,255,255,0.06)',
                  backgroundColor: isSelected ? `${test.color}08` : '#14141A',
                }}
              >
                {test.popular && (
                  <LinearGradient colors={[test.color, '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="px-5 py-2">
                    <Text className="text-white text-[11px] font-black uppercase tracking-widest">⭐ Most Popular</Text>
                  </LinearGradient>
                )}

                <View className="p-6">
                  {/* Title row */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-4">
                      <View className="flex-row items-center gap-3 mb-2">
                        <View
                          className="w-10 h-10 rounded-[14px] items-center justify-center border"
                          style={{ backgroundColor: `${test.color}15`, borderColor: `${test.color}30` }}
                        >
                          <Package color={test.color} size={20} />
                        </View>
                        <Text className="text-white text-[19px] font-black flex-1">{test.name}</Text>
                      </View>
                      <Text className="text-textSecondary text-[13px] leading-snug">{test.description}</Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? '' : ''}`}
                      style={{ borderColor: isSelected ? test.color : 'rgba(255,255,255,0.2)', backgroundColor: isSelected ? `${test.color}20` : 'transparent' }}
                    >
                      {isSelected && <CheckCircle2 color={test.color} size={14} />}
                    </View>
                  </View>

                  {/* Meta row */}
                  <View className="flex-row gap-3 mb-5">
                    <View className="flex-row items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                      <Clock color="#8A8A93" size={12} />
                      <Text className="text-textSecondary text-[12px] font-bold">{test.duration}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                      <FlaskConical color="#8A8A93" size={12} />
                      <Text className="text-textSecondary text-[12px] font-bold">{test.params} parameters</Text>
                    </View>
                  </View>

                  {/* Includes */}
                  <View className="flex-row flex-wrap gap-2 mb-5">
                    {test.includes.map((inc, i) => (
                      <View key={i} className="px-3 py-1 rounded-full" style={{ backgroundColor: `${test.color}12`, borderWidth: 1, borderColor: `${test.color}25` }}>
                        <Text className="text-[11px] font-bold" style={{ color: test.color }}>{inc}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Price row */}
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-textSecondary text-[12px] line-through mb-0.5">{test.originalPrice}</Text>
                      <Text className="text-white text-[28px] font-black">{test.price}</Text>
                    </View>
                    {isSelected && (
                      <View className="flex-row items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${test.color}20`, borderWidth: 1, borderColor: `${test.color}40` }}>
                        <CheckCircle2 color={test.color} size={16} />
                        <Text className="font-bold text-[13px]" style={{ color: test.color }}>Selected</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-background border-t border-white/5">
        <TouchableOpacity
          activeOpacity={selected ? 0.9 : 0.5}
          onPress={() => selected && router.back()}
          style={{ opacity: selected ? 1 : 0.5 }}
        >
          <LinearGradient
            colors={['#7C3AED', '#F472B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-[20px] py-5 items-center"
          >
            <Text className="text-white font-black text-[17px]">
              {selected ? `Book ${TESTS.find(t => t.id === selected)?.name}` : 'Select a Package'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
