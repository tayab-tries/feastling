import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import { restaurants } from '../../src/data/mockData';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

const deliveryFeeMap: Record<string, number> = {};
restaurants.forEach((r) => { deliveryFeeMap[r.id] = r.deliveryFee; });

export default function CartScreen() {
  const { items, getItemsByRestaurant, getSubtotal, getTotalDeliveryFee, updateQuantity, removeItem, clearCart, getItemCount } = useCart();
  const router = useRouter();
  const grouped = getItemsByRestaurant();
  const subtotal = getSubtotal();
  const deliveryFee = getTotalDeliveryFee(deliveryFeeMap);
  const total = subtotal + deliveryFee;
  const count = getItemCount();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} testID="cart-screen-empty">
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={64} color={COLORS.subtext} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from multiple restaurants{'\n'}and order them all at once!</Text>
          <TouchableOpacity testID="browse-btn" style={styles.browseBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="cart-screen">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity testID="clear-cart-btn" onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
        {Object.entries(grouped).map(([restaurantId, cartItems]) => {
          const restaurant = restaurants.find((r) => r.id === restaurantId);
          const groupSubtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
          return (
            <View key={restaurantId} style={styles.restaurantGroup} testID={`cart-group-${restaurantId}`}>
              <View style={styles.groupHeader}>
                <View style={styles.groupHeaderLeft}>
                  <Image source={{ uri: restaurant?.image }} style={styles.groupAvatar} />
                  <View>
                    <Text style={styles.groupName}>{cartItems[0].restaurantName}</Text>
                    <Text style={styles.groupDelivery}>${(restaurant?.deliveryFee || 0).toFixed(2)} delivery</Text>
                  </View>
                </View>
                <TouchableOpacity testID={`view-restaurant-${restaurantId}`} onPress={() => router.push(`/restaurant/${restaurantId}`)}>
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
                </TouchableOpacity>
              </View>

              {cartItems.map((item) => (
                <View key={`${item.id}-${item.restaurantId}`} style={styles.cartItem} testID={`cart-item-${item.id}`}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity testID={`decrease-${item.id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.restaurantId, -1)}>
                      <Ionicons name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={item.quantity === 1 ? COLORS.error : COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity testID={`increase-${item.id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.restaurantId, 1)}>
                      <Ionicons name="add" size={16} color={COLORS.accent} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.groupSubtotal}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalValue}>${groupSubtotal.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Items ({count})</Text>
          <Text style={styles.footerValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Delivery Fee</Text>
          <Text style={styles.footerValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          testID="place-order-btn"
          style={styles.orderBtn}
          onPress={() => router.push('/order-confirmation')}
          activeOpacity={0.85}
        >
          <Text style={styles.orderBtnText}>Place Order · ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  clearText: { fontSize: 14, color: COLORS.error, fontWeight: '600' },
  scroll: { flex: 1, paddingHorizontal: 24 },
  restaurantGroup: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusXl,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  groupHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  groupHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceLight },
  groupName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  groupDelivery: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background,
    borderRadius: SIZES.radius, padding: 10, marginBottom: 8,
  },
  itemImage: { width: 50, height: 50, borderRadius: 10 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.accent, marginTop: 4 },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 4, paddingVertical: 4,
  },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 20, textAlign: 'center' },
  groupSubtotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  subtotalLabel: { fontSize: 13, color: COLORS.subtext },
  subtotalValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  footerLabel: { fontSize: 14, color: COLORS.subtext },
  footerValue: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: COLORS.accent },
  orderBtn: {
    backgroundColor: COLORS.accent, borderRadius: SIZES.radiusLg,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
    ...SHADOWS.button,
  },
  orderBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: COLORS.subtext, textAlign: 'center', lineHeight: 22 },
  browseBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: SIZES.radiusLg, marginTop: 24, ...SHADOWS.button,
  },
  browseBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
