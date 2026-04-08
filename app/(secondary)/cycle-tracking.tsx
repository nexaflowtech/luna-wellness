import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CycleTrackingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <Text className="font-headline text-3xl font-extrabold text-on-surface">Cycle Tracker</Text>
        <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <Text className="text-on-surface font-bold">Current phase: Follicular</Text>
          <Text className="text-on-surface-variant mt-2">Day 7 of 28</Text>
          <Text className="text-primary mt-4">Tip: prioritize strength workouts and hydration.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
