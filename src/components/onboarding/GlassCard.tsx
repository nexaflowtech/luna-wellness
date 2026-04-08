import React from 'react';
import { View, ViewStyle } from 'react-native';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
};

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, style }) => {
  return (
    <View 
      className={`bg-white/70 rounded-lg p-6 shadow-xl ${className || ''}`}
      style={style}
    >
      {children}
    </View>
  );
};

export default GlassCard;
