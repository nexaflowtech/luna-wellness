import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CarouselCardProps {
  beforeImageUri: string;
  afterImageUri: string;
  resultTag: string;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({ beforeImageUri, afterImageUri, resultTag }) => {
  return (
    <View className="rounded-[24px] overflow-hidden mx-2 mb-4 w-[300px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
      <View className="flex-row h-[200px]">
        <View className="flex-1 border-r border-[#1A1A2E]">
          <Image source={{ uri: beforeImageUri }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">Before</Text>
          </View>
        </View>
        <View className="flex-1">
          <Image source={{ uri: afterImageUri }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute bottom-2 left-2 bg-[#7C3AED] px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">After</Text>
          </View>
        </View>
      </View>
      <View className="p-4 items-center justify-center flex-row gap-2" style={{ backgroundColor: 'transparent' }}>
         <View className="bg-[#10B981]/20 px-3 py-1.5 rounded-full flex-row items-center">
            <Text style={{ color: '#10B981' }} className="font-semibold text-xs ml-1">🥗 {resultTag}</Text>
         </View>
      </View>
    </View>
  );
};

export default CarouselCard;
