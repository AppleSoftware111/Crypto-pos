// Polyfill must be imported first
import 'text-encoding-polyfill';
import { TextEncoder, TextDecoder } from 'text-encoding';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/config';
import { getServerUrlOverride } from './src/utils/storage';
import { setApiBaseURL } from './src/api/apiClient';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

/**
 * Main App Component
 * Entry point for the React Native application
 */
export default function App() {
  useEffect(() => {
    getServerUrlOverride().then((url) => {
      if (url) setApiBaseURL(url);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

