import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useCartStore } from '@/store';
import { Button } from '@/components';
import { Colors, Spacing, Fonts, BorderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            clearCart();
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.authContainer}>
          <Ionicons name="person-circle-outline" size={100} color={Colors.textMuted} />
          <Text style={styles.authTitle}>Welcome to Autocuan Supply</Text>
          <Text style={styles.authText}>
            Sign in to access your orders, wishlist, and more
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Sign In"
              onPress={() => router.push('/auth/login')}
              variant="primary"
              fullWidth
            />
            <Button
              title="Create Account"
              onPress={() => router.push('/auth/register')}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          
          <MenuItem
            icon="bag-outline"
            title="My Orders"
            subtitle="View order history"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
          <MenuItem
            icon="heart-outline"
            title="Wishlist"
            subtitle="Your saved items"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
          <MenuItem
            icon="location-outline"
            title="Addresses"
            subtitle="Manage shipping addresses"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notifications"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Account security settings"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
          <MenuItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get support"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          />
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            icon={<Ionicons name="log-out-outline" size={20} color={Colors.primary} />}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Autocuan Supply v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Autocuan Supply. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, onPress }) => (
  <View style={styles.menuItem}>
    <View style={styles.menuItemIcon}>
      <Ionicons name={icon} size={24} color={Colors.primary} />
    </View>
    <View style={styles.menuItemContent}>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  authTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.xl,
    fontWeight: '700',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  authText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  authButtons: {
    width: '100%',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: Spacing.lg,
  },
  userName: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },
  userEmail: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.xs,
  },
  menuSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  menuTitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuItemTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: 2,
  },
  logoutSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  appVersion: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  appCopyright: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    marginTop: Spacing.xs,
  },
});
