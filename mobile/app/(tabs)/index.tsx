import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Image,
} from 'react-native';
import { useProductsStore } from '@/store';
import { ProductCard, CategoryFilterComponent, Input } from '@/components';
import { Colors, Spacing, Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const {
    filteredProducts,
    currentFilter,
    searchQuery,
    isLoading,
    loadProducts,
    setFilter,
    setSearchQuery,
  } = useProductsStore();

  const hotProducts = filteredProducts.filter((p) => p.isHot);

  const handleRefresh = async () => {
    await loadProducts();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoGold}>AUTOCUAN</Text>
          <Text style={styles.logoWhite}> SUPPLY</Text>
        </View>
        <Text style={styles.tagline}>Authentic Sneakers Guaranteed</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search sneakers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
        />
      </View>

      {/* Category Filter */}
      <CategoryFilterComponent
        currentFilter={currentFilter}
        onFilterChange={setFilter}
      />

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={
          hotProducts.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Hot Products</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading products...' : 'No products found'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGold: {
    color: Colors.primary,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
  },
  logoWhite: {
    color: Colors.text,
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Fonts.sizes.xl,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
});
