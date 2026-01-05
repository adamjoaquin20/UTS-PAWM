import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, useProductsStore, useAuthStore } from '@/store';
import { CartItemCard, Button } from '@/components';
import { formatPrice } from '@/lib/api';
import { Colors, Spacing, Fonts, BorderRadius } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, syncCart } = useCartStore();
  const { products } = useProductsStore();
  const { isAuthenticated, token } = useAuthStore();
  const total = useCartStore((state) => state.getTotal(products));

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to proceed with checkout',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') },
        ]
      );
      return;
    }

    // Sync cart to server
    if (token) {
      await syncCart(token);
    }

    Alert.alert(
      'Checkout',
      `Total: ${formatPrice(total)}\n\nThis is a demo. In production, this would proceed to payment.`,
      [{ text: 'OK' }]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some sneakers to get started!
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/')}
            variant="primary"
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return null;
          return (
            <CartItemCard
              item={item}
              product={product}
              onUpdateQuantity={(qty) =>
                updateQuantity(item.id, qty, item.size, item.condition)
              }
              onRemove={() => removeItem(item.id, item.size, item.condition)}
            />
          );
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              title="Clear Cart"
              onPress={handleClearCart}
              variant="ghost"
              size="sm"
            />
          </View>
        }
      />

      {/* Checkout Section */}
      <View style={styles.checkoutContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          variant="primary"
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

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
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.xl,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  checkoutContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.lg,
  },
  totalAmount: {
    color: Colors.primary,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
  },
});
