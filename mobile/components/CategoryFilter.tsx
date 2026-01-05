import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CategoryFilter } from '@/types';
import { Colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

interface CategoryFilterProps {
  currentFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
}

const categories: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'jordan', label: 'Air Jordan' },
  { key: 'nike', label: 'Nike' },
  { key: 'adidas', label: 'Adidas' },
  { key: 'yeezy', label: 'Yeezy' },
];

export const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={[
            styles.button,
            currentFilter === category.key && styles.buttonActive,
          ]}
          onPress={() => onFilterChange(category.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              currentFilter === category.key && styles.buttonTextActive,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: Colors.background,
  },
});
