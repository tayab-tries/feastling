import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOrders, Order } from '../../src/context/OrderContext';
import { COLORS, SIZES } from '../../src/constants/theme';

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const date = new Date(order.createdAt);
  const statusColors: Record<string, string> = {
    placed: COLORS.warning,
    accepted: COLORS.accent,
    preparing: COLORS.accent,
    ready: COLORS.success,
    picked_up: COLORS.success,
    delivered: COLORS.success,
  };

  return (
    <TouchableOpacity testID={`order-card-${order.id}`} style={styles.orderCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[order.status] }]} />
          <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
            {order.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </Text>
        </View>
      </View>
      <Text style={styles.restaurantNames}>{order.restaurantNames.join(' · ')}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.totalText}>${order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const { orders } = useOrders();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} testID="orders-screen">
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.subtext} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => router.push(`/order-tracking/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  orderCard: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  restaurantNames: { fontSize: 14, color: COLORS.subtext, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 12, color: COLORS.subtext },
  totalText: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: COLORS.subtext },
});
