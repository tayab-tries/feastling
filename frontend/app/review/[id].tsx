import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../src/context/OrderContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';

function StarRating({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} testID={`star-${star}`} onPress={() => onRate(star)} activeOpacity={0.7}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={40}
            color={star <= rating ? COLORS.accent : COLORS.subtext}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder } = useOrders();
  const order = getOrder(id || '');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push('/(tabs)/orders'), 2000);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} testID="review-success-screen">
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successSubtitle}>Your review has been submitted</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="review-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity testID="review-back-btn" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave a Review</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderIdText}>{order?.id || 'Order'}</Text>
            <Text style={styles.orderRestaurants}>
              {order?.restaurantNames.join(' · ') || 'Restaurants'}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>How was your experience?</Text>
            <StarRating rating={rating} onRate={setRating} />
            <Text style={styles.ratingHint}>
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Great'}
              {rating === 5 && 'Excellent!'}
            </Text>
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Share your thoughts</Text>
            <TextInput
              testID="review-comment-input"
              style={styles.commentInput}
              multiline
              numberOfLines={5}
              placeholder="What did you like or dislike about your order?"
              placeholderTextColor={COLORS.subtext}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            testID="submit-review-btn"
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Submit Review</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  orderInfo: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, marginBottom: 24, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  orderIdText: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  orderRestaurants: { fontSize: 14, color: COLORS.subtext, marginTop: 4 },
  ratingSection: { alignItems: 'center', marginBottom: 32 },
  ratingLabel: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 12 },
  ratingHint: { fontSize: 14, color: COLORS.accent, marginTop: 12, fontWeight: '600' },
  commentSection: { marginBottom: 24 },
  commentLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  commentInput: {
    backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLg,
    padding: 16, color: COLORS.text, fontSize: 15, minHeight: 120,
    borderWidth: 1, borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.accent, borderRadius: SIZES.radiusLg,
    paddingVertical: 16, alignItems: 'center', ...SHADOWS.button,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIcon: { marginBottom: 24 },
  successTitle: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  successSubtitle: { fontSize: 16, color: COLORS.subtext },
});
