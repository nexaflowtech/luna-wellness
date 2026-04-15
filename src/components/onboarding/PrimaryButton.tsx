import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

type PrimaryButtonProps = {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showArrow?: boolean;
  className?: string; // Add className prop
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  onPress, 
  title, 
  style, 
  textStyle,
  showArrow = false,
  className = ""
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      className={`w-full max-w-md self-center ${className}`}
      style={style}
    >
      <LinearGradient
        colors={['#7C3AED', '#F472B6']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-4 px-8 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        <Text className="text-textPrimary font-headline font-bold text-lg">
          {title}
        </Text>
        {showArrow && (
          <ArrowRight color="#ffffff" size={20} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
