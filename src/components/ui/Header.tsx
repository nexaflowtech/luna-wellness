import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

export function Header({ title, showBack = false, rightElement, transparent = false }: HeaderProps) {
  const router = useRouter();
  
  return (
    <View className={`flex-row items-center justify-between px-6 py-4 ${transparent ? '' : 'bg-background border-b border-surface'}`}>
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-surface border border-white/5">
            <ArrowLeft color="#FFFFFF" size={20} />
          </TouchableOpacity>
        )}
        {title && <Text className="font-headline text-xl font-bold text-textPrimary flex-1">{title}</Text>}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
}
