import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow, Typography, FontWeight } from '@/src/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const sizeMap: Record<Size, { py: number; px: number; fontSize: number }> = {
  sm: { py: 10, px: 16, fontSize: 13 },
  md: { py: 14, px: 24, fontSize: 15 },
  lg: { py: 17, px: 28, fontSize: 16 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading,
  fullWidth = true,
  icon,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const sz = sizeMap[size];
  const isDisabled = disabled || isLoading;

  const baseStyle: ViewStyle = {
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: sz.py,
    paddingHorizontal: sz.px,
    width: fullWidth ? '100%' : undefined,
    opacity: isDisabled ? 0.55 : 1,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity disabled={isDisabled} activeOpacity={0.85} style={style} {...props}>
        <LinearGradient
          colors={Colors.gradPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[baseStyle, Shadow.md]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <Text style={{ color: '#fff', fontSize: sz.fontSize, fontWeight: FontWeight.semibold }}>
                {label}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<Exclude<Variant, 'primary'>, { container: ViewStyle; text: string }> = {
    secondary: {
      container: { backgroundColor: Colors.primaryLight },
      text: Colors.primary,
    },
    outline: {
      container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
      text: Colors.primary,
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: Colors.primary,
    },
    danger: {
      container: { backgroundColor: Colors.errorLight, borderWidth: 1, borderColor: Colors.error },
      text: Colors.error,
    },
  };

  const vs = variantStyles[variant as Exclude<Variant, 'primary'>];

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[baseStyle, vs.container, style as ViewStyle]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={{ color: vs.text, fontSize: sz.fontSize, fontWeight: FontWeight.semibold }}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
