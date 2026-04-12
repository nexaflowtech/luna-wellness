import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SelectionCard } from './SelectionCard';

interface SelectionOption {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
}

interface SelectionGridProps {
  options: SelectionOption[];
  onSelect: (id: string | string[]) => void;
  single?: boolean;
  preSelected?: string[];
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({ options, onSelect, single = false, preSelected = [] }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(preSelected);

  const toggleSelection = (id: string) => {
    let newSelected: string[];
    if (single) {
      newSelected = [id];
    } else {
      if (selectedIds.includes(id)) {
        newSelected = selectedIds.filter((item) => item !== id);
      } else {
        newSelected = [...selectedIds, id];
      }
    }
    setSelectedIds(newSelected);
    onSelect(single ? newSelected[0] : newSelected);
  };

  return (
    <View style={styles.grid}>
      {options.map((option) => (
        <SelectionCard
          key={option.id}
          title={option.title}
          description={option.description}
          icon={option.icon}
          isRecommended={option.isRecommended}
          isSelected={selectedIds.includes(option.id)}
          onToggle={() => toggleSelection(option.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingVertical: 12,
  },
});

export default SelectionGrid;
