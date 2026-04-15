import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  useSafeArea?: boolean;
  edges?: Edge[];
  useKeyboardAvoiding?: boolean;
}

export function ScreenWrapper({ 
  children, 
  className = '', 
  useSafeArea = true, 
  edges = ['top', 'bottom'],
  useKeyboardAvoiding = false
}: ScreenWrapperProps) {
  const Wrapper: any = useSafeArea ? SafeAreaView : View;
  
  const content = useKeyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      {children}
    </KeyboardAvoidingView>
  ) : children;

  return (
    <Wrapper className={`flex-1 bg-background ${className}`} {...(useSafeArea ? { edges } : {})}>
      {content}
    </Wrapper>
  );
}
