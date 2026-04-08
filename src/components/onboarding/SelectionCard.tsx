import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isRecommended?: boolean;
  onToggle: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  isRecommended,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : isRecommended ? styles.cardRecommended : styles.cardDefault,
      ]}
    >
      <View style={styles.contentWrap}>
        <View style={[styles.iconWrap, isSelected ? styles.iconWrapSelected : styles.iconWrapDefault]}>
          {icon}
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {isRecommended && !description ? <Text style={styles.recommendedText}>Recommended for you</Text> : null}
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>

      <View style={[styles.checkWrap, isSelected ? styles.checkWrapSelected : styles.checkWrapDefault]}>
        {isSelected ? <Check color="#ffffff" size={14} strokeWidth={3} /> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: { backgroundColor: '#fdf0f4', borderColor: '#b7004e' },
  cardRecommended: { backgroundColor: '#fdf0f4', borderColor: 'transparent' },
  cardDefault: { backgroundColor: '#ffffff', borderColor: 'transparent' },
  contentWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconWrapSelected: { backgroundColor: '#b7004e' },
  iconWrapDefault: { backgroundColor: '#ffd9df' },
  textWrap: { flex: 1, paddingLeft: 14, paddingRight: 12 },
  title: { fontWeight: '700', fontSize: 16, color: '#181b27', lineHeight: 20 },
  recommendedText: {
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    fontSize: 10,
    color: '#b7004e',
  },
  description: { marginTop: 4, fontSize: 13, lineHeight: 18, color: '#5b3f44' },
  checkWrap: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkWrapSelected: { borderColor: '#b7004e', backgroundColor: '#b7004e' },
  checkWrapDefault: { borderColor: '#e4bdc3' },
});

export default SelectionCard;
