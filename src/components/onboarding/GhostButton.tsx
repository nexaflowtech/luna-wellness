import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { ArrowLeft } from 'lucide-react-native';

interface GhostButtonProps extends TouchableOpacityProps {
  iconColor?: string;
  iconSize?: number;
}

export function GhostButton({ style, iconColor = Colors.textPrimary, iconSize = 24, ...props }: GhostButtonProps) {
  return (
    <TouchableOpacity 
      style={[{
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.borderLight,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }, style as ViewStyle]} 
      activeOpacity={0.85}
      {...props}
    >
      <ArrowLeft color={iconColor} size={iconSize} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}
