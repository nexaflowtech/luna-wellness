import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isRecommended?: boolean;
  onToggle: () => void;
  className?: string; // Allow passing custom styles
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  isRecommended,
  onToggle,
  className = ""
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      className={`p-5 rounded-2xl border-2 mb-4 flex-row items-center justify-between shadow-sm ${className} ${isSelected ? 'bg-primary/10 border-primary' : isRecommended ? 'bg-primary/5 border-transparent' : 'bg-background-card border-white/5'
        }`}
    >
      <View className="flex-1 flex-row items-center">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-background-main border border-white/5'
          }`}>
          {icon}
        </View>

        <View className="flex-1 pl-4 pr-3">
          <Text className="font-bold text-base text-text-primary leading-snug">{title}</Text>
          {description ? <Text className="mt-0.5 text-[13px] leading-tight text-text-secondary">{description}</Text> : null}
          {isRecommended ? <Text className="mt-1.5 uppercase tracking-widest font-extrabold text-[10px] text-primary">Recommended for you</Text> : null}
        </View>
      </View>

      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-white/10'
        }`}>
        {isSelected ? <Check color="#ffffff" size={14} strokeWidth={3} /> : null}
      </View>
    </TouchableOpacity>
  );
};

export default SelectionCard;
