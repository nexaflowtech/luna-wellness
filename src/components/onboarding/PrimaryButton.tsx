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
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  showArrow = false,
  className = "",
  loading = false,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`w-full max-w-md self-center ${className} ${(disabled || loading) ? 'opacity-70' : ''}`}
      style={style}
    >
      <LinearGradient
        colors={['#7C3AED', '#F472B6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="py-4 px-8 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            <Text className="text-textPrimary font-bold text-lg">
              {title}
            </Text>
            {showArrow && (
              <ArrowRight color="#ffffff" size={20} />
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
