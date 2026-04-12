import React from 'react';
import { View, ScrollView, ViewProps, ScrollViewProps, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/theme';

export function ScreenContainer({ children, style, ...props }: SafeAreaViewProps) {
  return (
    <SafeAreaView 
      style={[{ flex: 1, backgroundColor: Colors.background }, style]} 
      edges={['top', 'bottom']}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

export function StepContainer({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  return (
    <ScrollView 
      contentContainerStyle={[{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 160, paddingTop: 16 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function CardSection({ children, style, ...props }: ViewProps) {
  const defaultStyle: ViewStyle = { 
    backgroundColor: Colors.surface, 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 24, 
    elevation: 3, 
    shadowColor: Colors.primary, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 15 
  };
  return (
    <View style={[defaultStyle, style]} {...props}>
      {children}
    </View>
  );
}
