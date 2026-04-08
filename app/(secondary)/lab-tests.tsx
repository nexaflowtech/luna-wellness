import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const TESTS = [
  { name: 'Thyroid Profile', price: '₹899' },
  { name: 'PCOS Hormone Panel', price: '₹1,499' },
  { name: 'Metabolic Health Check', price: '₹1,099' },
];

export default function LabTestsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <Text className="font-headline text-3xl font-extrabold text-on-surface">Lab Tests</Text>
        <Text className="text-on-surface-variant">Book hormone and wellness lab packages.</Text>
        {TESTS.map((test) => (
          <View key={test.name} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30">
            <Text className="font-headline text-lg font-bold text-on-surface">{test.name}</Text>
            <Text className="text-primary font-bold mt-1">{test.price}</Text>
          </View>
        ))}
        <TouchableOpacity className="bg-primary rounded-full py-4 items-center mt-4" onPress={() => router.back()}>
          <Text className="text-on-primary font-bold">Book Selected Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
