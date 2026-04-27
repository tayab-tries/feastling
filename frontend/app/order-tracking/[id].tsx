import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders, OrderStep } from '../../src/context/OrderContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

function StepIndicator({ step, isLast }: { step: OrderStep; isLast: boolean }) {
  const iconMap: Record<string, string> = {
    placed: 'checkmark-circle',
    accepted: 'thumbs-up',
    preparing: 'restaurant',
    ready: 'bag-check',
    picked_up: 'bicycle',
    delivered: 'home',
  };

  return (
    <View style={styles.stepRow}>
      <View style={styles.stepLeft}>
        <View style={[styles.stepCircle, step.completed && styles.stepCircleActive]}>
          <Ionicons
            name={(iconMap[step.status] || 'ellipse') as any}
            size={18}
            color={step.completed ? '#FFF' : COLORS.subtext}
          />
        </View>
        {!isLast && (
          <View style={[styles.stepLine, step.completed && styles.stepLineActive]} />
        )}
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepLabel, step.completed && styles.stepLabelActive]}>
          {step.label}
        </Text>
        <Text style={styles.stepTime}>
          {step.time || 'Pending'}
        </Text>
      </View>
    </View>
  );
}

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder } = useOrders();
  const order = getOrder(id || '');

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="order-tracking-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="tracking-back-btn" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.orderIdCard}>
          <View>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdValue}>{order.id}</Text>
          </View>
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={14} color={COLORS.accent} />
            <Text style={styles.etaText}>{order.estimatedDelivery}</Text>
          </View>
        </View>

        <View style={styles.restaurantRow}>
          <Ionicons name="restaurant-outline" size={16} color={COLORS.accent} />
          <Text style={styles.restaurantText}>{order.restaurantNames.join(' · ')}</Text>
        </View>

        <View style={styles.stepsContainer}>
          {order.steps.map((step, index) => (
            <StepIndicator
              key={step.status}
              step={step}
              isLast={index === order.steps.length - 1}
            />
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {order.items.map((item) => (
            <View key={`${item.id}-${item.restaurantId}`} style={styles.summaryItem}>
              <Text style={styles.summaryItemQty}>{item.quantity}x</Text>
              <Text style={styles.summaryItemName}>{item.name}</Text>
              <Text style={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          testID="track-driver-btn"
          style={styles.trackBtn}
          onPress={() => router.push(`/driver-tracking/${order.id}`)}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={20} color="#FFF" />
          <Text style={styles.trackBtnText}>Track Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="leave-review-btn"
          style={styles.reviewBtn}
          onPress={() => router.push(`/review/${order.id}`)}
          activeOpacity={0.85}
        >
          <Ionicons name="star-outline" size={20} color={COLORS.accent} />
          <Text style={styles.reviewBtnText}>Leave a Review</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  orderIdCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  orderIdLabel: { fontSize: 12, color: COLORS.subtext },
  orderIdValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  etaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.accentLight, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12,
  },
  etaText: { fontSize: 13, fontWeight: '600', color: COLORS.accent },
  restaurantRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24,
  },
  restaurantText: { fontSize: 14, color: COLORS.subtext },
  stepsContainer: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusXl,
    padding: 20, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  stepRow: { flexDirection: 'row', minHeight: 60 },
  stepLeft: { alignItems: 'center', width: 40 },
  stepCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceLight,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.border,
  },
  stepCircleActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  stepLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  stepLineActive: { backgroundColor: COLORS.accent },
  stepContent: { flex: 1, marginLeft: 12, paddingBottom: 16 },
  stepLabel: { fontSize: 15, fontWeight: '600', color: COLORS.subtext },
  stepLabelActive: { color: COLORS.text },
  stepTime: { fontSize: 12, color: COLORS.subtext, marginTop: 4 },
  summaryCard: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  summaryItemQty: { fontSize: 13, fontWeight: '700', color: COLORS.accent, width: 32 },
  summaryItemName: { flex: 1, fontSize: 14, color: COLORS.text },
  summaryItemPrice: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.accent, borderRadius: SIZES.radiusLg,
    paddingVertical: 16, marginBottom: 12, ...SHADOWS.button,
  },
  trackBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  reviewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    paddingVertical: 16, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  reviewBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.accent },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: COLORS.subtext },
});
