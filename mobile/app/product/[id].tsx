import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProductsStore, useCartStore, useAuthStore } from '@/store';
import { fetchProduct, formatPrice, calculateDiscount } from '@/lib/api';
import { Button } from '@/components';
import { Product } from '@/types';
import { Colors, Spacing, Fonts, BorderRadius, Shadow } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById } = useProductsStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('Brand New');
  const [isLoading, setIsLoading] = useState(true);

  const conditions = ['Brand New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      // Try from store first
      const cached = getProductById(Number(id));
      if (cached) {
        setProduct(cached);
        if (cached.sizes?.length > 0) {
          setSelectedSize(cached.sizes[0]);
        }
        setIsLoading(false);
        return;
      }
      // Fetch from API
      const fetched = await fetchProduct(Number(id));
      if (fetched) {
        setProduct(fetched);
        if (fetched.sizes?.length > 0) {
          setSelectedSize(fetched.sizes[0]);
        }
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }
    addItem(product.id, 1, selectedSize, selectedCondition);
    Alert.alert(
      'Added to Cart',
      `${product.name} (Size ${selectedSize}) has been added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before buying');
      return;
    }
    addItem(product.id, 1, selectedSize, selectedCondition);
    router.push('/cart');
  };

  if (isLoading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: product.image.startsWith('http') 
                ? product.image 
                : `https://your-backend-url.com/${product.image}` 
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.isHot && (
            <View style={styles.hotBadge}>
              <Ionicons name="flame" size={14} color={Colors.text} />
              <Text style={styles.hotText}>HOT</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>

          {/* Material */}
          <View style={styles.detailRow}>
            <Ionicons name="layers-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.detailText}>Material: {product.material}</Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Text>
          </View>

          {/* Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeGrid}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condition Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.conditionRow}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionButton,
                      selectedCondition === condition && styles.conditionButtonSelected,
                    ]}
                    onPress={() => setSelectedCondition(condition)}
                  >
                    <Text
                      style={[
                        styles.conditionText,
                        selectedCondition === condition && styles.conditionTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Guarantee */}
          <View style={styles.guaranteeSection}>
            <View style={styles.guaranteeItem}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              <Text style={styles.guaranteeText}>100% Authentic</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="cube" size={24} color={Colors.primary} />
              <Text style={styles.guaranteeText}>Free Shipping</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="refresh" size={24} color={Colors.primary} />
              <Text style={styles.guaranteeText}>Easy Returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          variant="outline"
          style={{ flex: 1 }}
          icon={<Ionicons name="cart-outline" size={20} color={Colors.primary} />}
        />
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
          variant="primary"
          style={{ flex: 1 }}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: Colors.card,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.hot,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  hotText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.discount,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  discountText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
  },
  infoContainer: {
    padding: Spacing.lg,
  },
  brand: {
    color: Colors.primary,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  name: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  price: {
    color: Colors.primary,
    fontSize: Fonts.sizes.hero,
    fontWeight: '700',
  },
  originalPrice: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.lg,
    textDecorationLine: 'line-through',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sizeButton: {
    width: 56,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeText: {
    color: Colors.text,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  sizeTextSelected: {
    color: Colors.background,
  },
  conditionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  conditionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  conditionText: {
    color: Colors.text,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  conditionTextSelected: {
    color: Colors.background,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
    lineHeight: 22,
  },
  guaranteeSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  guaranteeItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  guaranteeText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.xs,
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
