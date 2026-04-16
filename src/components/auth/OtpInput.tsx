import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

interface OtpInputProps {
    codeLength?: number;
    onCodeFilled: (code: string) => void;
    isLoading?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    codeLength = 6,
    onCodeFilled,
    isLoading = false
}) => {
    const [code, setCode] = useState<string[]>(new Array(codeLength).fill(''));
    const inputs = useRef<TextInput[]>([]);

    useEffect(() => {
        // Auto-focus first input on mount
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleChangeText = (text: string, index: number) => {
        const newCode = [...code];
        // Handle paste or multiple characters (if any)
        if (text.length > 1) {
            const pasteCode = text.slice(0, codeLength).split('');
            pasteCode.forEach((char, i) => {
                if (newCode[i] !== undefined) newCode[i] = char;
            });
            setCode(newCode);
            const lastIndex = Math.min(pasteCode.length, codeLength - 1);
            inputs.current[lastIndex]?.focus();

            if (pasteCode.length === codeLength) {
                onCodeFilled(pasteCode.join(''));
            }
            return;
        }

        newCode[index] = text;
        setCode(newCode);

        // Move to next input if text is entered
        if (text && index < codeLength - 1) {
            inputs.current[index + 1]?.focus();
        }

        // Check if code is filled
        if (newCode.every(char => char !== '') && newCode.length === codeLength) {
            onCodeFilled(newCode.join(''));
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        // Move to previous input on backspace if current is empty
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View className="flex-row justify-between w-full px-2" style={{ gap: 8 }}>
            {code.map((char, index) => (
                <View
                    key={index}
                    className={`w-12 h-16 rounded-2xl border-2 items-center justify-center bg-background ${code[index] ? 'border-primary bg-primary/5' : 'border-white/10'
                        }`}
                >
                    <TextInput
                        ref={(ref) => (inputs.current[index] = ref!)}
                        className="text-textPrimary text-2xl font-black text-center w-full h-full"
                        keyboardType="number-pad"
                        maxLength={index === 0 ? codeLength : 1} // Support paste in first index
                        value={char}
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        editable={!isLoading}
                        autoFocus={index === 0}
                        selectionColor="#7C3AED"
                    />
                </View>
            ))}
        </View>
    );
};
