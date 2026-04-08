import { View, TextInput, Text, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius, Typography, FontWeight } from '@/constants/theme';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  const borderColor = error
    ? Colors.error
    : focused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label && (
        <Text style={{ fontSize: 13, fontWeight: FontWeight.medium, color: Colors.textSecondary }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor,
          borderRadius: Radius.lg,
          backgroundColor: focused ? '#FAFAFF' : Colors.card,
          gap: 10,
          paddingHorizontal: 14,
          minHeight: 52,
        }}
      >
        {leftIcon && <View>{leftIcon}</View>}
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: Colors.text,
            paddingVertical: 12,
          }}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
              {secure ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
        {!secureTextEntry && rightIcon && <View>{rightIcon}</View>}
      </View>
      {(error || hint) && (
        <Text
          style={{
            fontSize: 12,
            color: error ? Colors.error : Colors.textMuted,
          }}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
