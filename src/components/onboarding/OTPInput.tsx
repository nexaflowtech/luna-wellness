import React, { useRef, useState } from 'react';
import { View, TextInput, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, value, onChange }) => {
  const [otpValues, setOTPValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOTPValues = [...otpValues];
    newOTPValues[index] = text;
    setOTPValues(newOTPValues);
    onChange(newOTPValues.join(''));

    if (text !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otpValues[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-4 w-full">
      {otpValues.map((v, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref; }}
          className={`w-14 h-16 bg-surface-container-high rounded-xl text-center text-2xl font-headline font-bold text-primary border-2 ${v !== '' ? 'border-primary bg-surface-container-lowest shadow-sm' : 'border-transparent'}`}
          maxLength={1}
          keyboardType="number-pad"
          value={v}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default OTPInput;
