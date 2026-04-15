import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  iconClassName?: string;
  borderLeftColor?: string;
}

export function DashboardCard({ 
  title, 
  subtitle, 
  icon, 
  rightElement, 
  onPress, 
  className = '',
  iconClassName = 'bg-primary/15 border-primary/20',
  borderLeftColor
}: DashboardCardProps) {
  const CardContainer: any = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      activeOpacity={0.9} 
      onPress={onPress}
      className={`flex-row items-center bg-surface p-4 rounded-2xl mb-3 ${className}`}
      style={borderLeftColor ? { borderLeftWidth: 4, borderLeftColor } : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
    >
      {icon && (
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 border ${iconClassName}`}>
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-textPrimary text-base font-bold">{title}</Text>
        {subtitle && <Text className="text-textSecondary text-sm mt-1">{subtitle}</Text>}
      </View>
      {rightElement && <View className="ml-2 pl-2">{rightElement}</View>}
    </CardContainer>
  );
}
