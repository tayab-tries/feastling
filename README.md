# 🍽️ FeastFleet — Multi-Restaurant Food Delivery App

Order from **multiple restaurants in a single cart** — items grouped by restaurant, with combined checkout.

![Expo](https://img.shields.io/badge/Expo_SDK-54-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen) ![React Native](https://img.shields.io/badge/React_Native-0.81-blue)

---

## Screenshots

| Login | Home | Restaurant |
|-------|------|------------|
| Dark login with Google Auth | Search, categories, featured restaurants | Menu items with Add to Cart |

| Multi-Restaurant Cart | Order Tracking | Driver Tracking |
|-----------------------|----------------|-----------------|
| Items grouped by restaurant | Status timeline | Simulated map view |

---

## Features

- **Google OAuth** login via Emergent Auth
- **Home screen** with search, category filters, featured & nearby restaurants
- **Restaurant detail** with categorized menu and add-to-cart
- **Multi-restaurant cart** (core feature) — items grouped by restaurant with per-group subtotals and delivery fees
- **Order confirmation** with delivery address, payment summary
- **Order tracking** with a 6-step status timeline
- **Driver tracking** with simulated map and driver info
- **Review screen** with star rating and comments
- **Profile** with stats, order history, and account settings
- **Dark premium theme** (#121212 / #1F1F1F / #FF8F00)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo SDK 54 + expo-router |
| Backend | Python FastAPI |
| Database | MongoDB (auth sessions only) |
| Auth | Emergent Google OAuth |
| Data | Static mock data (6 restaurants, 25 menu items) |

---

## Prerequisites

- **Node.js** >= 18
- **Yarn** >= 1.22
- **Python** >= 3.11
- **MongoDB** >= 6 (running locally on port 27017)
- **Expo CLI** (`npm install -g expo-cli` or use `npx expo`)

---

## Quick Start

### 1. Clone the repo

```bash
git clone <your-repo-url> feastfleet
cd feastfleet
```

### 2. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 3. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn motor python-dotenv pydantic requests

# Create .env
cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="feastfleet_db"
EOF

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at `http://localhost:8001/api/`.

### 4. Frontend setup

```bash
cd frontend

# Install dependencies
yarn install

# Create .env
cat > .env << 'EOF'
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
EOF

# Start Expo
npx expo start --web --port 3000
```

Open `http://localhost:3000` in your browser, or scan the QR code with **Expo Go** on your phone.

---

## Running on Mobile (Expo Go)

1. Install **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npx expo start` in the `frontend/` directory
3. Scan the QR code shown in the terminal
4. Make sure your phone and computer are on the **same Wi-Fi network**

> **Note:** For mobile, update `EXPO_PUBLIC_BACKEND_URL` in `frontend/.env` to your computer's local IP (e.g., `http://192.168.1.42:8001`).

---

## Project Structure

```
feastfleet/
├── backend/
│   ├── server.py              # FastAPI auth endpoints
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx        # Root layout with providers
│   │   ├── index.tsx          # Splash screen
│   │   ├── login.tsx          # Google Auth login
│   │   ├── auth-callback.tsx  # OAuth callback handler
│   │   ├── order-confirmation.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx    # Tab navigator
│   │   │   ├── index.tsx      # Home screen
│   │   │   ├── cart.tsx       # Multi-restaurant cart ⭐
│   │   │   ├── orders.tsx     # Order history
│   │   │   └── profile.tsx    # User profile
│   │   ├── restaurant/
│   │   │   └── [id].tsx       # Restaurant detail + menu
│   │   ├── order-tracking/
│   │   │   └── [id].tsx       # Order status timeline
│   │   ├── driver-tracking/
│   │   │   └── [id].tsx       # Driver map view
│   │   └── review/
│   │       └── [id].tsx       # Rate & review
│   ├── src/
│   │   ├── constants/theme.ts # Colors, sizes, shadows
│   │   ├── context/
│   │   │   ├── AuthContext.tsx # Authentication state
│   │   │   ├── CartContext.tsx # Cart management
│   │   │   └── OrderContext.tsx# Order management
│   │   └── data/mockData.ts   # Mock restaurants & menus
│   ├── app.json
│   ├── package.json
│   └── .env
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Health check |
| `POST` | `/api/auth/session` | Exchange OAuth session_id for user data |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/auth/logout` | Logout and clear session |

---

## Demo Walkthrough

1. **Login** — Tap "Continue with Google" to authenticate
2. **Browse** — Search or filter restaurants by category (Burgers, Pizza, Sushi, etc.)
3. **Order** — Open a restaurant, tap "+ Add" on menu items
4. **Mix & match** — Go back, open another restaurant, add more items
5. **Cart** — Switch to the Cart tab — items are grouped by restaurant with delivery fees
6. **Checkout** — Place Order → Review summary → Confirm Order
7. **Track** — Watch order progress through 6 status stages
8. **Review** — Rate your experience with stars and comments

---

## Skipping Auth for Local Demo

If you just want to browse the app without setting up Google OAuth, you can seed a test user directly:

```bash
# With MongoDB running, open mongosh:
mongosh --eval "
use('feastfleet_db');
db.users.insertOne({
  user_id: 'demo-user',
  email: 'demo@feastfleet.com',
  name: 'Demo User',
  picture: '',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: 'demo-user',
  session_token: 'demo_token_123',
  expires_at: new Date(Date.now() + 30*24*60*60*1000),
  created_at: new Date()
});
"
```

Then open your browser console on `http://localhost:3000` and run:

```javascript
document.cookie = "session_token=demo_token_123; path=/";
location.reload();
```

You'll be logged in as "Demo User" and can explore all screens.

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#121212` | Screen backgrounds |
| Surface | `#1F1F1F` | Cards, modals |
| Accent | `#FF8F00` | CTAs, active states, highlights |
| Text | `#FFFFFF` | Primary text |
| Subtext | `#B0B0B0` | Secondary text, labels |
| Success | `#22C55E` | Delivered status, confirmations |
| Error | `#EF4444` | Delete, clear actions |
| Border radius | `12–16px` | Buttons and cards |

---

## License

MIT
