import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';
import { OrderProvider } from '../src/context/OrderContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="auth-callback" />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="restaurant/[id]" />
            <Stack.Screen name="order-confirmation" />
            <Stack.Screen name="order-tracking/[id]" />
            <Stack.Screen name="driver-tracking/[id]" />
            <Stack.Screen name="review/[id]" />
          </Stack>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
