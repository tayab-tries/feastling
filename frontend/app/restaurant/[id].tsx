import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import { getRestaurantById } from '../../src/data/mockData';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem, getItemQuantity, updateQuantity, getItemCount } = useCart();
  const restaurant = getRestaurantById(id || '');

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  const cartCount = getItemCount();
  const menuByCategory = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menu>);

  return (
    <View style={styles.container} testID="restaurant-detail-screen">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: cartCount > 0 ? 100 : 24 }}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <SafeAreaView style={styles.heroNav}>
            <TouchableOpacity testID="back-btn" style={styles.navBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={COLORS.accent} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
            </View>
            <Text style={styles.metaSep}>·</Text>
            <Ionicons name="time-outline" size={14} color={COLORS.subtext} />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            <Text style={styles.metaSep}>·</Text>
            <Ionicons name="bicycle-outline" size={14} color={COLORS.subtext} />
            <Text style={styles.metaText}>${restaurant.deliveryFee.toFixed(2)}</Text>
          </View>
        </View>

        {Object.entries(menuByCategory).map(([category, items]) => (
          <View key={category} style={styles.menuSection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items.map((item) => {
              const qty = getItemQuantity(item.id, restaurant.id);
              return (
                <View key={item.id} style={styles.menuCard} testID={`menu-item-${item.id}`}>
                  <Image source={{ uri: item.image }} style={styles.menuImage} />
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.menuBottom}>
                      <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
                      {qty === 0 ? (
                        <TouchableOpacity
                          testID={`add-to-cart-${item.id}`}
                          style={styles.addBtn}
                          onPress={() => addItem({
                            id: item.id,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          })}
                        >
                          <Ionicons name="add" size={18} color="#FFF" />
                          <Text style={styles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyRow}>
                          <TouchableOpacity testID={`qty-minus-${item.id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.id, restaurant.id, -1)}>
                            <Ionicons name="remove" size={16} color={COLORS.text} />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{qty}</Text>
                          <TouchableOpacity testID={`qty-plus-${item.id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.id, restaurant.id, 1)}>
                            <Ionicons name="add" size={16} color={COLORS.accent} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {cartCount > 0 && (
        <View style={styles.cartBar}>
          <TouchableOpacity testID="view-cart-btn" style={styles.cartBarBtn} onPress={() => router.push('/(tabs)/cart')} activeOpacity={0.85}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartBarText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  errorText: { color: COLORS.error, fontSize: 16, textAlign: 'center', marginTop: 100 },
  heroContainer: { height: 240, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    opacity: 0.4,
  },
  heroNav: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 8 },
  navBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoSection: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  restaurantName: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: COLORS.accent },
  reviewCount: { fontSize: 13, color: COLORS.subtext },
  metaSep: { color: COLORS.subtext },
  metaText: { fontSize: 13, color: COLORS.subtext },
  menuSection: { paddingHorizontal: 24, marginBottom: 16 },
  categoryTitle: {
    fontSize: 18, fontWeight: '700', color: COLORS.text,
    marginBottom: 12, marginTop: 8,
  },
  menuCard: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  menuImage: { width: 100, height: 110 },
  menuInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  menuName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: 12, color: COLORS.subtext, lineHeight: 17, marginTop: 4 },
  menuBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  menuPrice: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accent, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderLight,
  },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 20, textAlign: 'center' },
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 34, paddingTop: 12,
    backgroundColor: COLORS.background,
  },
  cartBarBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.accent, borderRadius: SIZES.radiusLg, paddingVertical: 16,
    gap: 10, ...SHADOWS.button,
  },
  cartBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  cartBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  cartBarText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
