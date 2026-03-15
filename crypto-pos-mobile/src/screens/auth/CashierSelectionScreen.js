import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getCashiers } from '../../api/endpoints';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * CashierSelectionScreen
 * Second step of two-level authentication
 * Displays list of cashiers for the logged-in company
 */
const CashierSelectionScreen = ({ route, navigation }) => {
  const { company, logout } = useAuth();
  const { companyId, companyName } = route.params || {};
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCashier, setSelectedCashier] = useState(null);

  useEffect(() => {
    loadCashiers();
  }, []);

  const loadCashiers = async () => {
    try {
      setLoading(true);
      const cashierList = await getCashiers(companyId || company?.id);
      setCashiers(cashierList);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to load cashiers. Please try again.',
        [
          { text: 'Retry', onPress: loadCashiers },
          {
            text: 'Back',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCashierSelect = (cashier) => {
    setSelectedCashier(cashier);
    // Navigate to cashier login
    navigation.navigate('CashierLogin', {
      companyId: companyId || company?.id,
      companyName: companyName || company?.name,
      cashierId: cashier.id,
      cashierName: cashier.name,
    });
  };

  const handleBack = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout from company account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('CompanyLogin');
          },
        },
      ]
    );
  };

  const renderCashierItem = ({ item }) => {
    const isActive = item.status === 'active' || item.status === 'enabled';
    
    return (
      <TouchableOpacity
        style={[styles.cashierCard, !isActive && styles.cashierCardDisabled]}
        onPress={() => isActive && handleCashierSelect(item)}
        disabled={!isActive || loading}
      >
        <View style={styles.cashierInfo}>
          <View style={styles.cashierHeader}>
            <Text style={styles.cashierName}>{item.name}</Text>
            {item.status && (
              <View
                style={[
                  styles.statusBadge,
                  isActive ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text style={styles.statusText}>
                  {isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            )}
          </View>
          {item.id && (
            <Text style={styles.cashierId}>ID: {item.id}</Text>
          )}
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading cashiers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Cashier</Text>
        <Text style={styles.subtitle}>
          {companyName || company?.name || 'Company'}
        </Text>
      </View>

      {/* Cashier List */}
      <FlatList
        data={cashiers}
        renderItem={renderCashierItem}
        keyExtractor={(item) => item.id || item.cashier_id || `cashier-${item.name}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cashiers available</Text>
            <Text style={styles.emptySubtext}>
              Please contact administrator to add cashiers
            </Text>
          </View>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
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
  listContainer: {
    padding: 16,
  },
  cashierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cashierCardDisabled: {
    opacity: 0.5,
    borderColor: COLORS.textSecondary,
  },
  cashierInfo: {
    flex: 1,
  },
  cashierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cashierName: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusActive: {
    backgroundColor: COLORS.success + '20',
  },
  statusInactive: {
    backgroundColor: COLORS.error + '20',
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
  },
  cashierId: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: FONT_SIZES.xlarge,
    color: COLORS.primary,
    marginLeft: 12,
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
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default CashierSelectionScreen;
