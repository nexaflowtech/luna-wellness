import { View, ViewStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  variant?: 'default' | 'flat' | 'outlined';
}

export function Card({ children, style, onPress, padded = true, variant = 'default' }: CardProps) {
  const variantStyle: ViewStyle = {
    default: {
      backgroundColor: Colors.card,
      borderRadius: Radius['2xl'],
      ...(padded ? { padding: 20 } : {}),
      ...Shadow.sm,
    } as ViewStyle,
    flat: {
      backgroundColor: Colors.card,
      borderRadius: Radius['2xl'],
      ...(padded ? { padding: 20 } : {}),
    } as ViewStyle,
    outlined: {
      backgroundColor: Colors.card,
      borderRadius: Radius['2xl'],
      borderWidth: 1,
      borderColor: Colors.border,
      ...(padded ? { padding: 20 } : {}),
    } as ViewStyle,
  }[variant];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={[variantStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[variantStyle, style]}>{children}</View>;
}
