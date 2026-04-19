import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

type PrimaryButtonProps = {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showArrow?: boolean;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  title,
  showArrow = false,
  className = "",
  loading = false,
  disabled = false,
  icon
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`w-full ${className} ${(disabled || loading) ? 'opacity-70' : ''}`}
    >
      <LinearGradient
        colors={['#006e2f', '#006b5f']} // Luna Master Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-5 px-8 rounded-3xl flex-row items-center justify-center gap-2 shadow-xl shadow-primary/20"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Text className="text-white font-bold text-lg tracking-tight">
              {title}
            </Text>
            {icon ? icon : (showArrow && <ArrowRight color="#ffffff" size={20} />)}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
