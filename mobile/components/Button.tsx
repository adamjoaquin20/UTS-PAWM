import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      borderRadius: BorderRadius.md,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
      md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
      lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: Colors.primary },
      secondary: { backgroundColor: Colors.card },
      outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary },
      ghost: { backgroundColor: 'transparent' },
    };

    return [
      base,
      sizeStyles[size],
      variantStyles[variant],
      fullWidth && { width: '100%' },
      disabled && { opacity: 0.5 },
      style,
    ].filter(Boolean) as ViewStyle[];
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle = {
      fontWeight: '600',
    };

    const sizeStyles: Record<string, TextStyle> = {
      sm: { fontSize: Fonts.sizes.sm },
      md: { fontSize: Fonts.sizes.md },
      lg: { fontSize: Fonts.sizes.lg },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: { color: Colors.background },
      secondary: { color: Colors.text },
      outline: { color: Colors.primary },
      ghost: { color: Colors.primary },
    };

    return [base, sizeStyles[size], variantStyles[variant], textStyle].filter(Boolean) as TextStyle[];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.background : Colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
