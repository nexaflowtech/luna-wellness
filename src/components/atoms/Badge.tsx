import { View, Text, ViewStyle } from 'react-native';
import { Colors, Radius, FontWeight } from '@/constants/theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: ViewStyle;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  primary: { bg: Colors.primaryLight, text: Colors.primary, dot: Colors.primary },
  success: { bg: Colors.successLight, text: Colors.success, dot: Colors.success },
  warning: { bg: Colors.warningLight, text: Colors.warning, dot: Colors.warning },
  error: { bg: Colors.errorLight, text: Colors.error, dot: Colors.error },
  info: { bg: Colors.infoLight, text: Colors.info, dot: Colors.info },
  neutral: { bg: Colors.borderLight, text: Colors.textSecondary, dot: Colors.textMuted },
};

export function Badge({ label, variant = 'primary', size = 'sm', dot, style }: BadgeProps) {
  const cfg = variantConfig[variant];
  const fontSize = size === 'sm' ? 11 : 13;
  const py = size === 'sm' ? 3 : 6;
  const px = size === 'sm' ? 9 : 12;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: cfg.bg,
          borderRadius: Radius.full,
          paddingVertical: py,
          paddingHorizontal: px,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: cfg.dot,
          }}
        />
      )}
      <Text style={{ fontSize, fontWeight: FontWeight.semibold, color: cfg.text }}>
        {label}
      </Text>
    </View>
  );
}
