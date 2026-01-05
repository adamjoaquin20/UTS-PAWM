import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '@/constants/theme';
import { useCartStore } from '@/store';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showCart = true,
  rightAction,
}) => {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.getItemCount());

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View style={styles.logoContainer}>
              <Text style={styles.logoGold}>AUTOCUAN</Text>
              <Text style={styles.logoWhite}> SUPPLY</Text>
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightAction || (
            showCart && (
              <TouchableOpacity
                onPress={() => router.push('/cart')}
                style={styles.iconButton}
              >
                <Ionicons name="cart-outline" size={24} color={Colors.text} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGold: {
    color: Colors.primary,
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
  },
  logoWhite: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
  },
  iconButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
});
