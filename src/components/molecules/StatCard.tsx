import { View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow, Typography, FontWeight } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: string;
  trend?: string;
  trendPositive?: boolean;
  gradient?: readonly [string, string, ...string[]];
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendPositive = true,
  gradient,
  style,
}: StatCardProps) {
  const content = (
    <View style={{ gap: 4 }}>
      {icon && <Text style={{ fontSize: 22, marginBottom: 4 }}>{icon}</Text>}
      <Text
        style={{
          fontSize: 11,
          fontWeight: FontWeight.semibold,
          color: gradient ? 'rgba(255,255,255,0.75)' : Colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: FontWeight.bold,
            color: gradient ? '#fff' : Colors.text,
          }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: FontWeight.medium,
              color: gradient ? 'rgba(255,255,255,0.6)' : Colors.textMuted,
              paddingBottom: 3,
            }}
          >
            {unit}
          </Text>
        )}
      </View>
      {trend && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: FontWeight.medium,
            color: gradient
              ? 'rgba(255,255,255,0.75)'
              : trendPositive
              ? Colors.success
              : Colors.error,
          }}
        >
          {trendPositive ? '↑' : '↓'} {trend}
        </Text>
      )}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: Radius['2xl'], padding: 20, ...Shadow.md }, style]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: Colors.card,
          borderRadius: Radius['2xl'],
          padding: 20,
          ...Shadow.sm,
        },
        style,
      ]}
    >
      {content}
    </View>
  );
}
