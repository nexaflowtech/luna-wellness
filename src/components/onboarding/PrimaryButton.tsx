import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '@/src/constants/theme';

type PrimaryButtonProps = {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showArrow?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  onPress, 
  title, 
  style, 
  textStyle,
  showArrow = false
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      className="w-full max-w-md self-center"
      style={style}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.accent]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-5 px-8 rounded-full flex-row items-center justify-center gap-3 shadow-lg"
      >
        <Text className="text-white font-headline font-bold text-lg">
          {title}
        </Text>
        {showArrow && (
          <ArrowRight color="#ffffff" size={24} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
