# Crypto POS Mobile - React Native App

A professional React Native mobile application for the Crypto POS system. Accept cryptocurrency payments on Android (and iOS) with real-time blockchain monitoring.

## Features

- 💰 Support for multiple cryptocurrencies (BTC, USDT, AVAX, USDC, etc.)
- 📱 QR code generation for easy payment
- ✅ Real-time payment status monitoring
- 🔄 Automatic payment detection (checks every 2 seconds)
- 📋 One-tap address copying
- 🎨 Modern, intuitive UI
- 🔒 Secure API communication
- ⚡ Fast and responsive

## Prerequisites

### Windows 10 Development Setup

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK (API 33 or higher recommended)
   - Set up an Android Virtual Device (AVD) or connect a physical device
   - Set environment variable `ANDROID_HOME` (usually `C:\Users\YourName\AppData\Local\Android\Sdk`)

3. **Expo CLI** (or React Native CLI)
   ```bash
   npm install -g expo-cli
   # OR
   npm install -g react-native-cli
   ```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd crypto-pos-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Base URL:**
   
   Edit `crypto-pos-mobile/.env` and set `EXPO_PUBLIC_API_BASE_URL`:
   
   - **Android Emulator:** `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000`
   - **Physical device:** Use your PC's LAN IP, e.g. `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:4000` (find IP: `ipconfig` on Windows)
   - Phone and PC must be on the same Wi‑Fi when using a physical device.

   **Required:** Start the backend before opening the app: from project root run `node server.js` (server runs on port 4000).

## Running the App

### Using Expo (Recommended)

1. **Start the Expo development server:**
   ```bash
   npm start
   # OR
   expo start
   ```

2. **Run on Android:**
   - Press `a` in the terminal, or
   - Scan QR code with Expo Go app on your Android device, or
   - Click "Run on Android device/emulator" in Expo DevTools

3. **Run on iOS (macOS only):**
   - Press `i` in the terminal

**Troubleshooting connection errors**

- **"Cannot connect to Metro"** – Start the app with `npm start` in `crypto-pos-mobile`. For a physical device, ensure it’s on the same Wi‑Fi as your PC and run `adb devices`.
- **"No response from server" / "timeout exceeded"** – Start the backend: in project root run `node server.js` so it listens on port 4000. On a **physical device**, set `EXPO_PUBLIC_API_BASE_URL` in `.env` to your PC’s IP (e.g. `http://192.168.1.100:4000`), not `10.0.2.2`.

### Using React Native CLI

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   # OR
   npx react-native run-android
   ```

3. **Run on iOS (macOS only):**
   ```bash
   npm run ios
   # OR
   npx react-native run-ios
   ```

## Project Structure

```
crypto-pos-mobile/
├── App.js                 # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration
├── src/
│   ├── api/             # API client and endpoints
│   │   ├── apiClient.js
│   │   └── endpoints.js
│   ├── components/      # Reusable components
│   │   ├── CoinCard.js
│   │   ├── QRCodeDisplay.js
│   │   ├── PaymentStatus.js
│   │   └── AddressCopy.js
│   ├── screens/         # App screens
│   │   ├── PaymentMethodScreen.js
│   │   ├── AmountInputScreen.js
│   │   └── PaymentDisplayScreen.js
│   ├── hooks/           # Custom React hooks
│   │   ├── usePaymentMonitoring.js
│   │   └── useCoins.js
│   ├── models/          # Data models
│   │   ├── Coin.js
│   │   └── Payment.js
│   ├── navigation/      # Navigation setup
│   │   └── AppNavigator.js
│   └── utils/           # Utilities and config
│       └── config.js
└── assets/              # Images, fonts, etc.
```

## Configuration

### API Configuration

All API settings are in `src/utils/config.js`:

- `API_BASE_URL`: Your backend server URL
- `PAYMENT_CHECK_INTERVAL`: How often to check payment status (default: 2000ms)
- `MAX_RETRIES`: Maximum payment check attempts (default: 450 = 15 minutes)
- `QR_CODE_SIZE`: QR code display size (default: 300)

### Theme Colors

Colors are defined in `src/utils/config.js` - `COLORS` object. You can customize:
- Primary color
- Success/error/warning colors
- Background and surface colors
- Text colors

## Usage

1. **Start Backend Server:**
   ```bash
   # In your backend directory
   npm start
   ```

2. **Launch Mobile App:**
   ```bash
   # In crypto-pos-mobile directory
   npm start
   ```

3. **App Flow:**
   - Select payment method (coin)
   - Enter payment amount
   - Generate payment request
   - Display QR code and address
   - Monitor payment status (automatic)
   - Payment confirmation notification

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to server

**Solutions:**
1. Verify backend server is running on port 4000
2. Check `API_BASE_URL` in `src/utils/config.js`
3. For emulator: Use `10.0.2.2:4000`
4. For physical device: Use your computer's IP address
5. Check firewall settings (allow port 4000)
6. Ensure device/emulator and server are on same network

### Build Errors

**Problem:** Build fails with dependency errors

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear cache: `npm start -- --reset-cache`
4. For Expo: `expo start -c` (clear cache)

### QR Code Not Displaying

**Problem:** QR code doesn't appear

**Solutions:**
1. Check that `react-native-svg` is installed
2. Verify payment data includes `qrData` or `address`
3. Check console for errors

### Payment Status Not Updating

**Problem:** Payment status remains "pending"

**Solutions:**
1. Verify backend API is accessible
2. Check network connectivity
3. Verify payment was actually sent on blockchain
4. Check backend logs for errors

## Development Tips

1. **Enable Developer Menu:**
   - Shake device or press `Ctrl+M` (Android emulator)
   - Press `Cmd+D` (iOS simulator)

2. **Reload App:**
   - Press `R` twice quickly in Metro bundler
   - Or shake device and select "Reload"

3. **Debug:**
   - Use React Native Debugger
   - Enable remote debugging in Dev Menu
   - Check Metro bundler logs

4. **Network Debugging:**
   - Enable network inspection in Dev Menu
   - Use tools like Reactotron or Flipper

## Building for Production

### Android APK

1. **Generate keystore:**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in `android/app/build.gradle`**

3. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

### Using Expo Build

```bash
expo build:android
```

## Security Notes

1. **API Security:**
   - Use HTTPS in production
   - Implement certificate pinning
   - Validate all API responses

2. **Code Security:**
   - Never commit API keys or secrets
   - Use environment variables for sensitive data
   - Enable ProGuard/R8 for release builds

3. **Network Security:**
   - Verify SSL certificates
   - Use secure storage for sensitive data
   - Implement proper error handling

## Support

For issues or questions:
1. Check backend server logs
2. Review Metro bundler console
3. Verify API endpoints are accessible
4. Test with backend health check endpoint

## License

MIT

## Version

1.0.0

---

**Made with ❤️ for Crypto POS System**

