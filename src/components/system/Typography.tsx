import React from 'react';
import { Text, TextProps } from 'react-native';
import { Typography as Typos, Colors, FontWeight } from '@/src/constants/theme';

interface TypoProps extends TextProps {
  color?: string;
  className?: string; // allow NativeWind to override
}

export function HeadingXL({ children, style, color = Colors.textPrimary, ...props }: TypoProps) {
  return <Text style={[{ fontSize: Typos['3xl'].fontSize, lineHeight: Typos['3xl'].lineHeight, fontWeight: FontWeight.extrabold, color, textAlign: 'center' }, style]} {...props}>{children}</Text>;
}

export function HeadingL({ children, style, color = Colors.textPrimary, ...props }: TypoProps) {
  return <Text style={[{ fontSize: Typos['xl'].fontSize, lineHeight: Typos['xl'].lineHeight, fontWeight: FontWeight.bold, color }, style]} {...props}>{children}</Text>;
}

export function BodyM({ children, style, color = Colors.textSecondary, ...props }: TypoProps) {
  return <Text style={[{ fontSize: Typos.base.fontSize, lineHeight: Typos.base.lineHeight, fontWeight: FontWeight.medium, color, textAlign: 'center' }, style]} {...props}>{children}</Text>;
}

export function Caption({ children, style, color = Colors.rose || Colors.primary, ...props }: TypoProps) {
  return <Text style={[{ fontSize: Typos.xs.fontSize, lineHeight: Typos.xs.lineHeight, fontWeight: FontWeight.bold, textTransform: 'uppercase', letterSpacing: 1.2, color }, style]} {...props}>{children}</Text>;
}
