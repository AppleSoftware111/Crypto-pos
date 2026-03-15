import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Auth screens
import CompanyLoginScreen from '../screens/auth/CompanyLoginScreen';
import CashierSelectionScreen from '../screens/auth/CashierSelectionScreen';
import CashierLoginScreen from '../screens/auth/CashierLoginScreen';

// Main app screens
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import AmountInputScreen from '../screens/AmountInputScreen';
import PaymentDisplayScreen from '../screens/PaymentDisplayScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

// Payment flow screens
import CryptoRateScreen from '../screens/payments/CryptoRateScreen';
import CustomerDetailsScreen from '../screens/payments/CustomerDetailsScreen';
import SecurityCodeScreen from '../screens/payments/SecurityCodeScreen';
import PaymentSuccessScreen from '../screens/payments/PaymentSuccessScreen';
import CardConfirmationScreen from '../screens/payments/CardConfirmationScreen';
import CardInputScreen from '../screens/payments/CardInputScreen';
import CardDetailsScreen from '../screens/payments/CardDetailsScreen';
import QRWalletScreen from '../screens/payments/QRWalletScreen';

// Context and config
import { AuthProvider, useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/config';

const Stack = createStackNavigator();

/**
 * AuthNavigator
 * Handles authentication flow (Company Login → Cashier Selection → Cashier Login)
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="CompanyLogin" component={CompanyLoginScreen} />
      <Stack.Screen name="CashierSelection" component={CashierSelectionScreen} />
      <Stack.Screen name="CashierLogin" component={CashierLoginScreen} />
    </Stack.Navigator>
  );
};

/**
 * MainAppNavigator
 * Handles main POS app screens (protected routes)
 */
const MainAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PaymentMethod"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{
          title: 'Crypto POS',
          headerShown: false, // Custom header in screen
        }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{
          title: 'Transaction History',
        }}
      />
      <Stack.Screen
        name="AmountInput"
        component={AmountInputScreen}
        options={{
          title: 'Enter Amount',
        }}
      />
      <Stack.Screen
        name="PaymentDisplay"
        component={PaymentDisplayScreen}
        options={{
          title: 'Payment Request',
          headerLeft: null, // Prevent back navigation
        }}
      />
      
      {/* Crypto Payment Flow */}
      <Stack.Screen
        name="CryptoRate"
        component={CryptoRateScreen}
        options={{
          title: 'Crypto Rate',
        }}
      />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetailsScreen}
        options={{
          title: 'Customer Details',
        }}
      />
      <Stack.Screen
        name="SecurityCode"
        component={SecurityCodeScreen}
        options={{
          title: 'Security Code',
        }}
      />
      
      {/* Card Payment Flow */}
      <Stack.Screen
        name="CardConfirmation"
        component={CardConfirmationScreen}
        options={{
          title: 'Confirm Payment',
        }}
      />
      <Stack.Screen
        name="CardInput"
        component={CardInputScreen}
        options={{
          title: 'Card Input',
        }}
      />
      <Stack.Screen
        name="CardDetails"
        component={CardDetailsScreen}
        options={{
          title: 'Card Details',
        }}
      />
      
      {/* QR Wallet Flow */}
      <Stack.Screen
        name="QRWallet"
        component={QRWalletScreen}
        options={{
          title: 'QR Wallet Payment',
        }}
      />
      
      {/* Success Screen */}
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          title: 'Payment Success',
          headerLeft: null, // Prevent back navigation
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * RootNavigator
 * Determines which navigator to show based on authentication status
 */
const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure auth state is initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainAppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

/**
 * AppNavigator
 * Main navigation wrapper with AuthProvider
 */
const AppNavigator = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
