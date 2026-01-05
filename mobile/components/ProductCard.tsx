import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/api';
import { Colors, Spacing, BorderRadius, Fonts, Shadow } from '@/constants/theme';
import { getImageUrl } from '@/constants/config';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - Spacing.lg * 3) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(product.image) }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.isHot && (
            <View style={styles.hotBadge}>
              <Ionicons name="flame" size={12} color={Colors.text} />
              <Text style={styles.hotText}>HOT</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>

          <View style={styles.sizesContainer}>
            <Text style={styles.sizesLabel}>
              Sizes: {product.sizes.slice(0, 3).join(', ')}
              {product.sizes.length > 3 ? '...' : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  imageContainer: {
    position: 'relative',
    height: cardWidth,
    backgroundColor: Colors.backgroundSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.hot,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  hotText: {
    color: Colors.text,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.discount,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  discountText: {
    color: Colors.text,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.md,
  },
  brand: {
    color: Colors.primary,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  name: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  price: {
    color: Colors.primary,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },
  originalPrice: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    textDecorationLine: 'line-through',
  },
  sizesContainer: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sizesLabel: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.xs,
  },
});
