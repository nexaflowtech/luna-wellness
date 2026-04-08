import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MealDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <Text className="font-headline text-3xl font-extrabold text-on-surface">Meal Detail</Text>
        <View className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <Text className="font-headline text-xl font-bold text-on-surface">Quinoa Protein Bowl</Text>
          <Text className="text-on-surface-variant mt-2">Ingredients: quinoa, tofu, spinach, avocado, seeds.</Text>
          <Text className="text-primary font-semibold mt-4">620 kcal • Protein 32g • Carbs 64g • Fat 18g</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
