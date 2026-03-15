import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useCoins } from '../hooks/useCoins';
import PaymentMethodCard from '../components/PaymentMethodCard';
import { COLORS, FONT_SIZES } from '../utils/config';
import { getApiBaseUrl } from '../utils/dashboardConfig';
import { mergePaymentMethods, PAYMENT_METHOD_TYPES } from '../utils/paymentMethods';
import { useAuth } from '../context/AuthContext';

/**
 * PaymentMethodScreen
 * Displays grid of available payment methods (Currencies screen)
 * Matches OMARA Pay POS interface from video
 */
const PaymentMethodScreen = ({ navigation }) => {
  const { coins, loading, error, refetch } = useCoins();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

  // Merge server coins with static payment methods
  const paymentMethods = mergePaymentMethods(coins);

  const getMethodCode = (method) =>
    method?.methodCode || method?.method_code || method?.id || null;

  const handleMethodSelect = (method) => {
    const normalizedMethod = {
      ...method,
      methodCode: getMethodCode(method),
    };

    if (method.type === PAYMENT_METHOD_TYPES.CRYPTO) {
      if (!normalizedMethod.methodCode) {
        Alert.alert('Error', 'Invalid cryptocurrency configuration.');
        return;
      }
      // Navigate to crypto flow
      navigation.navigate('CryptoRate', { method: normalizedMethod });
    } else if (method.type === PAYMENT_METHOD_TYPES.CARD) {
      // Navigate to card flow
      navigation.navigate('CardConfirmation', { method: normalizedMethod });
    } else if (method.type === PAYMENT_METHOD_TYPES.QR_WALLET) {
      // Navigate to QR wallet flow
      navigation.navigate('QRWallet', { method: normalizedMethod });
    } else {
      // Fallback to amount input (for backward compatibility)
      navigation.navigate('AmountInput', { coin: normalizedMethod });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will automatically switch to auth screens
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert(
        'Error',
        error || 'Failed to load payment methods. Please check your server connection.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: refetch },
        ]
      );
    }
  }, [error]);

  if (loading && paymentMethods.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }

  if (error && paymentMethods.length === 0) {
    let displayError = error;
    if (error.includes('teapot') || error.includes('418')) {
      displayError = 'Cannot connect to server. Please check:\n\n1. Backend server is running on port 4000\n2. API_BASE_URL is correct\n3. Device can reach the server';
    }
    
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>
          {displayError || 'Unable to connect to server. Please check your configuration.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render grid item
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.gridItem}>
        <PaymentMethodCard
          method={item}
          onPress={() => handleMethodSelect(item)}
          baseUrl={apiBaseUrl}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Currencies</Text>
          <Text style={styles.subtitle}>Select payment method</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Methods Grid */}
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.methodCode || `method-${item.name}`}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payment methods available</Text>
            <Text style={styles.emptySubtext}>
              Please configure payment methods in the admin panel
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
  },
  historyButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.error + '20',
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
    maxWidth: '32%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default PaymentMethodScreen;
