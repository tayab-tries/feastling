import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

export default function DriverTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder } = useOrders();
  const order = getOrder(id || '');

  return (
    <SafeAreaView style={styles.container} testID="driver-tracking-screen">
      <View style={styles.header}>
        <TouchableOpacity testID="driver-back-btn" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Driver</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 6 }).map((_, row) => (
            <View key={row} style={styles.gridRow}>
              {Array.from({ length: 6 }).map((_, col) => (
                <View key={col} style={styles.gridCell} />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.routeLine} />
        <View style={styles.routeLineVert} />

        <View style={styles.restaurantMarker}>
          <Ionicons name="restaurant" size={18} color="#FFF" />
        </View>

        <View style={styles.driverMarker}>
          <Ionicons name="bicycle" size={20} color="#FFF" />
        </View>

        <View style={styles.destinationMarker}>
          <Ionicons name="home" size={18} color="#FFF" />
        </View>

        <View style={styles.etaOverlay}>
          <Ionicons name="time" size={16} color={COLORS.accent} />
          <Text style={styles.etaOverlayText}>
            {order?.estimatedDelivery || '30-45 min'}
          </Text>
        </View>
      </View>

      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={28} color={COLORS.accent} />
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>John D.</Text>
            <View style={styles.driverRating}>
              <Ionicons name="star" size={12} color={COLORS.accent} />
              <Text style={styles.driverRatingText}>4.9</Text>
            </View>
          </View>
        </View>

        <View style={styles.driverActions}>
          <TouchableOpacity testID="call-driver-btn" style={styles.actionBtn}>
            <Ionicons name="call" size={20} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity testID="message-driver-btn" style={styles.actionBtn}>
            <Ionicons name="chatbubble" size={20} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Vehicle</Text>
          <Text style={styles.vehicleValue}>Honda CB300R</Text>
        </View>
        <View style={styles.vehicleDivider} />
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Plate</Text>
          <Text style={styles.vehicleValue}>AB 1234</Text>
        </View>
        <View style={styles.vehicleDivider} />
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Order</Text>
          <Text style={styles.vehicleValue}>{order?.id || 'N/A'}</Text>
        </View>
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
  mapContainer: {
    flex: 1, marginHorizontal: 24, borderRadius: SIZES.radiusXl,
    backgroundColor: COLORS.surface, overflow: 'hidden', position: 'relative',
    borderWidth: 1, borderColor: COLORS.border,
  },
  mapGrid: { flex: 1, padding: 20, justifyContent: 'space-between' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCell: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.borderLight,
  },
  routeLine: {
    position: 'absolute', top: '35%', left: '15%', width: '55%',
    height: 3, backgroundColor: COLORS.accent, borderRadius: 2,
  },
  routeLineVert: {
    position: 'absolute', top: '35%', left: '70%',
    width: 3, height: '35%', backgroundColor: COLORS.accent, borderRadius: 2,
  },
  restaurantMarker: {
    position: 'absolute', top: '28%', left: '10%',
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.button,
  },
  driverMarker: {
    position: 'absolute', top: '28%', left: '45%',
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.accentGlow,
    ...SHADOWS.button,
  },
  destinationMarker: {
    position: 'absolute', top: '63%', left: '65%',
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.success,
    alignItems: 'center', justifyContent: 'center',
  },
  etaOverlay: {
    position: 'absolute', top: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(18, 18, 18, 0.9)', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12,
  },
  etaOverlayText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, marginHorizontal: 24, marginTop: 16,
    borderRadius: SIZES.radiusLg, padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  driverDetails: {},
  driverName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  driverRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  driverRatingText: { fontSize: 13, fontWeight: '600', color: COLORS.subtext },
  driverActions: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  vehicleInfo: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, marginHorizontal: 24, marginTop: 12,
    borderRadius: SIZES.radiusLg, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.border,
  },
  vehicleItem: { flex: 1, alignItems: 'center' },
  vehicleLabel: { fontSize: 11, color: COLORS.subtext, marginBottom: 4 },
  vehicleValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  vehicleDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
});
