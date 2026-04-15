import React from 'react';
import { View, Text } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View className="w-full flex-row items-center gap-2 mb-6">
      <View className="flex-1 flex-row">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep - 1;
          const isCompleted = i < currentStep - 1;
          return (
            <View
              key={i}
              className={`h-2 rounded-full mr-1 ${
                isActive ? 'bg-accent flex-1' : isCompleted ? 'bg-accent/40 w-4' : 'bg-surface border border-white/5 w-4'
              }`}
            />
          );
        })}
      </View>
      <Text className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Step {currentStep} of {totalSteps}</Text>
    </View>
  );
};

export default ProgressIndicator;
