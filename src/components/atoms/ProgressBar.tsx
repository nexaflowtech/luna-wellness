import { View, Text, ViewStyle, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Colors, Radius, FontWeight } from '@/constants/theme';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  value,
  color = Colors.primary,
  trackColor = Colors.primaryLight,
  height = 8,
  showLabel,
  label,
  animated = true,
  style,
}: ProgressBarProps) {
  const filled = Math.min(100, Math.max(0, value));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: filled,
        duration: 700,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(filled);
    }
  }, [filled]);

  return (
    <View style={[{ gap: 6 }, style]}>
      {(showLabel || label) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {label && (
            <Text style={{ fontSize: 13, color: Colors.textSecondary, fontWeight: FontWeight.medium }}>
              {label}
            </Text>
          )}
          {showLabel && (
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>{filled}%</Text>
          )}
        </View>
      )}
      <View
        style={{
          height,
          backgroundColor: trackColor,
          borderRadius: Radius.full,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height,
            borderRadius: Radius.full,
            backgroundColor: color,
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
}
