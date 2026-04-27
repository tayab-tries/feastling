import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  Image, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import {
  restaurants, categories, getFeaturedRestaurants, searchRestaurants,
  getRestaurantsByCategory, Restaurant,
} from '../../src/data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

function CategoryChip({ item, selected, onPress }: { item: typeof categories[0]; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      testID={`category-${item.id}`}
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon as any} size={16} color={selected ? '#FFF' : COLORS.subtext} />
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function FeaturedCard({ item, onPress }: { item: Restaurant; onPress: () => void }) {
  return (
    <TouchableOpacity testID={`featured-${item.id}`} style={styles.featuredCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay} />
      <View style={styles.featuredInfo}>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={COLORS.accent} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredMeta}>{item.deliveryTime} · {item.distance}</Text>
      </View>
    </TouchableOpacity>
  );
}

function RestaurantCard({ item, onPress }: { item: Restaurant; onPress: () => void }) {
  return (
    <TouchableOpacity testID={`restaurant-${item.id}`} style={styles.restaurantCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingSmall}>
            <Ionicons name="star" size={12} color={COLORS.accent} />
            <Text style={styles.ratingSmallText}>{item.rating}</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{item.deliveryTime}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{item.distance}</Text>
        </View>
        <Text style={styles.deliveryFee}>
          {item.deliveryFee === 0 ? 'Free delivery' : `$${item.deliveryFee.toFixed(2)} delivery`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featured = getFeaturedRestaurants();
  const filteredRestaurants = search
    ? searchRestaurants(search)
    : getRestaurantsByCategory(selectedCategory);

  const goToRestaurant = (id: string) => router.push(`/restaurant/${id}`);

  return (
    <SafeAreaView style={styles.container} testID="home-screen">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Foodie'} 👋</Text>
            <Text style={styles.headerSubtitle}>What are you craving?</Text>
          </View>
          <TouchableOpacity testID="home-profile-btn" onPress={() => router.push('/(tabs)/profile')}>
            <Image
              source={{ uri: user?.picture || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.subtext} />
          <TextInput
            testID="search-input"
            style={styles.searchInput}
            placeholder="Search restaurants or dishes..."
            placeholderTextColor={COLORS.subtext}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.subtext} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              item={cat}
              selected={selectedCategory === cat.id}
              onPress={() => { setSelectedCategory(cat.id); setSearch(''); }}
            />
          ))}
        </ScrollView>

        {!search && selectedCategory === 'all' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <FlatList
              horizontal
              data={featured}
              keyExtractor={(i) => i.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingRight: 24 }}
              renderItem={({ item }) => (
                <FeaturedCard item={item} onPress={() => goToRestaurant(item.id)} />
              )}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {search ? 'Search Results' : 'Nearby Restaurants'}
          </Text>
          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={COLORS.subtext} />
              <Text style={styles.emptyText}>No restaurants found</Text>
            </View>
          ) : (
            filteredRestaurants.map((item) => (
              <RestaurantCard key={item.id} item={item} onPress={() => goToRestaurant(item.id)} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 24 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16,
  },
  greeting: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  headerSubtitle: { fontSize: 14, color: COLORS.subtext, marginTop: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    marginHorizontal: 24, borderRadius: SIZES.radiusLg, paddingHorizontal: 16,
    height: 50, gap: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15 },
  categoryRow: { paddingHorizontal: 24, paddingVertical: 16, gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { fontSize: 13, color: COLORS.subtext, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  featuredCard: {
    width: CARD_WIDTH * 0.75, height: 200, borderRadius: SIZES.radiusXl,
    overflow: 'hidden', ...SHADOWS.card,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accentLight, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: COLORS.accent },
  featuredName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  featuredMeta: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  restaurantCard: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  restaurantImage: { width: 110, height: 110 },
  restaurantInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  restaurantName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingSmall: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingSmallText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  dot: { color: COLORS.subtext, fontSize: 13 },
  metaText: { fontSize: 13, color: COLORS.subtext },
  deliveryFee: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 15, color: COLORS.subtext, marginTop: 12 },
});
