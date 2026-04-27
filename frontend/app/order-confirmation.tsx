import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../src/context/CartContext';
import { useOrders } from '../src/context/OrderContext';
import { restaurants } from '../src/data/mockData';
import { COLORS, SIZES, SHADOWS } from '../src/constants/theme';

const deliveryFeeMap: Record<string, number> = {};
restaurants.forEach((r) => { deliveryFeeMap[r.id] = r.deliveryFee; });

export default function OrderConfirmation() {
  const router = useRouter();
  const { items, getItemsByRestaurant, getSubtotal, getTotalDeliveryFee, clearCart } = useCart();
  const { createOrder } = useOrders();

  const grouped = getItemsByRestaurant();
  const subtotal = getSubtotal();
  const deliveryFee = getTotalDeliveryFee(deliveryFeeMap);
  const total = subtotal + deliveryFee;

  const handleConfirm = () => {
    const order = createOrder([...items], subtotal, deliveryFee);
    clearCart();
    router.replace(`/order-tracking/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No items to confirm</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="order-confirmation-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="confirm-back-btn" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryIcon}>
            <Ionicons name="location" size={24} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryLabel}>Delivery Address</Text>
            <Text style={styles.deliveryAddress}>123 Main Street, Downtown</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.subtext} />
        </View>

        <View style={styles.timeCard}>
          <Ionicons name="time-outline" size={20} color={COLORS.accent} />
          <Text style={styles.timeText}>Estimated delivery: 30-45 min</Text>
        </View>

        {Object.entries(grouped).map(([restaurantId, cartItems]) => {
          const restaurant = restaurants.find((r) => r.id === restaurantId);
          return (
            <View key={restaurantId} style={styles.orderGroup}>
              <View style={styles.groupHeader}>
                <Image source={{ uri: restaurant?.image }} style={styles.groupAvatar} />
                <Text style={styles.groupName}>{cartItems[0].restaurantName}</Text>
              </View>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Text style={styles.itemQty}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentCard}>
            <Ionicons name="card" size={24} color={COLORS.accent} />
            <Text style={styles.paymentText}>**** **** **** 4242</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity testID="confirm-order-btn" style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmBtnText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  scroll: { flex: 1, paddingHorizontal: 24 },
  deliveryCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  deliveryIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  deliveryLabel: { fontSize: 12, color: COLORS.subtext },
  deliveryAddress: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  timeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.accentLight, borderRadius: SIZES.radius,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20,
  },
  timeText: { fontSize: 14, fontWeight: '600', color: COLORS.accent },
  orderGroup: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  groupAvatar: { width: 32, height: 32, borderRadius: 8 },
  groupName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  orderItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  itemQty: { fontSize: 14, fontWeight: '700', color: COLORS.accent, width: 32 },
  itemName: { flex: 1, fontSize: 14, color: COLORS.text },
  itemPrice: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  paymentSection: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  paymentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  paymentText: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: COLORS.subtext },
  summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: COLORS.accent },
  confirmBtn: {
    backgroundColor: COLORS.accent, borderRadius: SIZES.radiusLg,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
    ...SHADOWS.button,
  },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  emptyText: { fontSize: 16, color: COLORS.subtext, textAlign: 'center', marginTop: 100 },
  backBtn: { alignSelf: 'center', marginTop: 20, backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
});
