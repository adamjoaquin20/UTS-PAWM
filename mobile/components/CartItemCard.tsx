import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, CartItem } from '@/types';
import { formatPrice } from '@/lib/api';
import { Colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

interface CartItemCardProps {
  item: CartItem;
  product: Product;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  product,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image.startsWith('http') ? product.image : `https://your-backend-url.com/${product.image}` }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{product.brand}</Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        {item.size && <Text style={styles.variant}>Size: {item.size}</Text>}
        {item.condition && <Text style={styles.variant}>Condition: {item.condition}</Text>}
        
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(Math.max(0, item.qty - 1))}
            >
              <Ionicons name="remove" size={16} color={Colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.qty}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.qty + 1)}
            >
              <Ionicons name="add" size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.subtotal}>
          Subtotal: {formatPrice(product.price * item.qty)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  name: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    marginVertical: Spacing.xs,
  },
  variant: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  price: {
    color: Colors.primary,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  quantity: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    paddingHorizontal: Spacing.md,
  },
  subtotal: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
});
