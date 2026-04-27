import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useOrders } from '../../src/context/OrderContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

function MenuItem({ icon, label, value, onPress }: { icon: string; label: string; value?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity testID={`profile-menu-${label.toLowerCase().replace(/\s/g, '-')}`} style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon as any} size={20} color={COLORS.accent} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.subtext} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();

  return (
    <SafeAreaView style={styles.container} testID="profile-screen">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.picture || 'https://via.placeholder.com/80' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {[...new Set(orders.flatMap((o) => o.restaurantNames))].length}
            </Text>
            <Text style={styles.statLabel}>Restaurants</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon="person-outline" label="Edit Profile" />
          <MenuItem icon="location-outline" label="Addresses" value="2 saved" />
          <MenuItem icon="card-outline" label="Payment Methods" />
          <MenuItem icon="heart-outline" label="Favorites" />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuItem icon="notifications-outline" label="Notifications" />
          <MenuItem icon="globe-outline" label="Language" value="English" />
          <MenuItem icon="moon-outline" label="Dark Mode" value="On" />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem icon="help-circle-outline" label="Help Center" />
          <MenuItem icon="document-text-outline" label="Terms of Service" />
          <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" />
        </View>

        <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, paddingTop: 8, marginBottom: 24 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  profileImage: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.surfaceLight },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  profileEmail: { fontSize: 14, color: COLORS.subtext, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: COLORS.accent },
  statLabel: { fontSize: 12, color: COLORS.subtext, marginTop: 4 },
  menuSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.subtext, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuContent: { flex: 1, marginLeft: 12 },
  menuLabel: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  menuValue: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: SIZES.radiusLg,
    paddingVertical: 16, marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});
