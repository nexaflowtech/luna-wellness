import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontWeight, Typography } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: { label: string; onPress: () => void };
  style?: ViewStyle;
  light?: boolean; // white text mode for dark/gradient backgrounds
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
  style,
  light = false,
}: ScreenHeaderProps) {
  const textColor = light ? '#fff' : Colors.text;
  const subColor = light ? 'rgba(255,255,255,0.75)' : Colors.textSecondary;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingBottom: 8,
          gap: 12,
        },
        style,
      ]}
    >
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: light ? 'rgba(255,255,255,0.2)' : Colors.borderLight,
          }}
        >
          <Text style={{ fontSize: 18, color: textColor }}>←</Text>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ ...Typography['2xl'], fontWeight: FontWeight.bold, color: textColor }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ ...Typography.sm, color: subColor }}>{subtitle}</Text>
        )}
      </View>

      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: FontWeight.semibold,
              color: light ? '#fff' : Colors.primary,
            }}
          >
            {rightAction.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
