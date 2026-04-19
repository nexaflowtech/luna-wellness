import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (val: number) => void;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, min, max, onChange, highlight }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-gray-100 flex-1">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="font-bold text-on-surface-variant text-sm uppercase tracking-widest">{label}</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-extrabold text-on-surface tracking-tighter">{value}</Text>
          <Text className="text-on-surface-variant font-medium text-sm">{unit}</Text>
        </View>
      </View>

      <View className="h-2 rounded-full overflow-hidden mb-6 bg-surface-container-high w-full relative">
        <View
          className="absolute left-0 top-0 bottom-0 bg-[#006e2f] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-1 h-12 rounded-xl items-center justify-center bg-surface-container-low border border-[#006e2f]/10"
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Minus color="#006e2f" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-1 h-12 rounded-xl items-center justify-center bg-surface-container-low border border-[#006e2f]/10"
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Plus color="#006e2f" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MetricCard;
