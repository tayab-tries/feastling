# FeastFleet - Multi-Restaurant Food Delivery App

## Overview
FeastFleet is a food delivery app that allows users to order from multiple restaurants in a single cart. The core innovation is the multi-restaurant cart grouping feature where items are visually grouped by restaurant with separate delivery fees.

## Tech Stack
- **Frontend**: React Native (Expo SDK 54) with expo-router
- **Backend**: FastAPI with MongoDB
- **Auth**: Emergent-managed Google OAuth
- **Data**: Static mock data for restaurants/menus, real backend for auth

## Screens
1. **Splash Screen** - Animated logo with auto-redirect based on auth state
2. **Login Screen** - Hero image with Google Auth button
3. **Auth Callback** - Handles OAuth redirect
4. **Home Screen** (Tab) - Search, categories, featured & nearby restaurants
5. **Cart Screen** (Tab) - Items grouped by restaurant with totals (CORE FEATURE)
6. **Orders Screen** (Tab) - Order history list
7. **Profile Screen** (Tab) - User info, stats, settings, logout
8. **Restaurant Detail** - Menu items with add-to-cart, quantity controls
9. **Order Confirmation** - Summary with delivery address, payment, confirm button
10. **Order Tracking** - Vertical timeline with status steps
11. **Driver Tracking** - Simulated map with driver/route visualization
12. **Review Screen** - Star rating and comment input

## Design System
- Dark theme: #121212 background, #1F1F1F cards, #FF8F00 accent
- Rounded corners (12-16px radius)
- Card-based layout with soft shadows
- Consistent golden orange CTAs throughout

## Key Features
- **Multi-Restaurant Cart**: Items grouped by restaurant with individual subtotals and delivery fees
- **Google Auth**: Emergent OAuth with session management
- **Search & Filter**: Search restaurants/dishes, filter by category
- **Order Flow**: Cart → Confirmation → Tracking → Review
- **Responsive Design**: Works on web preview, Expo Go, and native builds

## API Endpoints
- `POST /api/auth/session` - Exchange session_id for user data
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout and clear session

## File Structure
```
frontend/
  app/
    _layout.tsx          # Root layout with providers
    index.tsx            # Splash screen
    login.tsx            # Login screen
    auth-callback.tsx    # OAuth callback handler
    order-confirmation.tsx
    (tabs)/
      _layout.tsx        # Tab navigator (Home, Cart, Orders, Profile)
      index.tsx          # Home screen
      cart.tsx           # Multi-restaurant cart
      orders.tsx         # Order history
      profile.tsx        # User profile
    restaurant/[id].tsx  # Restaurant detail
    order-tracking/[id].tsx
    driver-tracking/[id].tsx
    review/[id].tsx
  src/
    constants/theme.ts   # Colors, sizes, shadows
    context/
      AuthContext.tsx     # Authentication state
      CartContext.tsx     # Cart management
      OrderContext.tsx    # Order management
    data/mockData.ts     # Mock restaurants & menus
backend/
  server.py              # FastAPI auth endpoints
```
