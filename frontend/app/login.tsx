import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SHADOWS } from '../src/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.container} testID="login-screen">
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <View style={styles.logoRow}>
              <Text style={styles.logoIcon}>🍽️</Text>
              <Text style={styles.logoName}>FeastFleet</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.title}>Order from{'\n'}multiple restaurants</Text>
          <Text style={styles.subtitle}>
            One cart, multiple restaurants.{'\n'}Get everything delivered together.
          </Text>

          <TouchableOpacity
            testID="google-login-btn"
            style={styles.googleButton}
            onPress={login}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={22} color="#FFFFFF" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  heroSection: { height: '50%', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
  },
  heroText: {
    position: 'absolute',
    top: 40,
    left: 24,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { fontSize: 28 },
  logoName: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtext,
    lineHeight: 22,
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    ...SHADOWS.button,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 12,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 16,
  },
});
