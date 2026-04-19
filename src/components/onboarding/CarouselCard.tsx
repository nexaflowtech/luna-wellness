import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface CarouselCardProps {
  imageUri: string;
  tag: string;
  quote: string;
  tagColor?: string; // Optional custom color for the tag background
}

export const CarouselCard: React.FC<CarouselCardProps> = ({ imageUri, tag, quote, tagColor = 'rgba(34, 197, 94, 0.2)' }) => {
  return (
    <View
      className="rounded-[32px] overflow-hidden mx-2 shadow-sm border border-black/5"
      style={{ width: width * 0.7, height: 400 }}
    >
      <Image
        source={{ uri: imageUri }}
        className="w-full h-full object-cover"
      />

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(11, 28, 48, 0.9)']}
        className="absolute inset-0"
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
      />

      <View className="absolute bottom-6 left-6 right-6">
        <View
          className="self-start px-3 py-1 rounded-full border border-white/10 mb-2"
          style={{ backgroundColor: tagColor }}
        >
          <Text className="text-white text-[10px] font-bold tracking-[2px] uppercase">{tag}</Text>
        </View>
        <Text className="text-white text-[15px] font-medium leading-tight">
          "{quote}"
        </Text>
      </View>
    </View>
  );
};

export default CarouselCard;
