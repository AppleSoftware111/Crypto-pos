import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { usePaymentMonitoring } from '../hooks/usePaymentMonitoring';
import QRCodeDisplay from '../components/QRCodeDisplay';
import AddressCopy from '../components/AddressCopy';
import PaymentStatus from '../components/PaymentStatus';
import ReceiptService from '../services/ReceiptService';
import { useAuth } from '../context/AuthContext';
import { simulatePaymentConfirm } from '../api/endpoints';
import { COLORS, FONT_SIZES } from '../utils/config';

/**
 * PaymentDisplayScreen
 * Displays payment QR code, address, and monitors payment status
 */
const PaymentDisplayScreen = ({ route, navigation }) => {
  const { paymentData, coin, amount, method, usdAmount, phoneNumber } = route.params || {};
  const displayCoin = coin || method;
  const { payment, confirmed, remainingTime } = usePaymentMonitoring(
    paymentData.paymentId
  );
  const { cashier, company } = useAuth();
  const [printing, setPrinting] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (confirmed && payment) {
      // Navigate to success screen
      const routeParams = route.params || {};
      navigation.replace('PaymentSuccess', {
        payment,
        method: coin || routeParams.method,
        amount: amount || routeParams.amount,
        usdAmount: routeParams.usdAmount,
        phoneNumber: routeParams.phoneNumber,
        txHash: payment.txHash,
      });
    }
  }, [confirmed, payment, amount, coin, navigation, route.params]);

  const handleNewPayment = () => {
    navigation.navigate('PaymentMethod');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.navigate('PaymentMethod'),
        },
      ]
    );
  };

  const handleSimulatePaid = async () => {
    if (simulating || confirmed) return;
    try {
      setSimulating(true);
      const data = await simulatePaymentConfirm(paymentData.paymentId);
      if (data && data.confirmed) {
        navigation.replace('PaymentSuccess', {
          payment: {
            paymentId: data.paymentId,
            status: data.status,
            confirmed: data.confirmed,
            amount: data.amount,
            method: data.method,
            address: data.address,
            txHash: data.txHash,
            confirmedAt: data.confirmedAt,
          },
          method: coin || route.params?.method,
          amount: amount || route.params?.amount,
          usdAmount: route.params?.usdAmount,
          phoneNumber: route.params?.phoneNumber,
          txHash: data.txHash,
        });
      }
    } catch (e) {
      Alert.alert('Simulate failed', e.message || 'Could not simulate confirmation.');
    } finally {
      setSimulating(false);
    }
  };

  const handlePrintReceipt = async () => {
    try {
      setPrinting(true);
      
      const receiptData = ReceiptService.generateReceiptData({
        payment: payment || paymentData,
        method: displayCoin,
        amount: amount || paymentData.amount,
        usdAmount,
        phoneNumber,
        securityCode: route.params?.securityCode,
        companyName: company?.name,
        cashierName: cashier?.name,
        qrData: paymentData.qrData || paymentData.address,
      });

      await ReceiptService.printReceipt(receiptData);
    } catch (error) {
      Alert.alert('Error', 'Failed to print receipt. Please try again.');
    } finally {
      setPrinting(false);
    }
  };

  const status = payment?.status || 'pending';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Payment Request</Text>
        <Text style={styles.subtitle}>Scan QR code or copy address to pay</Text>
      </View>

      {/* Payment Info Cards */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Amount</Text>
        <Text style={styles.infoValue}>
          {amount} {displayCoin?.symbol || displayCoin?.name || ''}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Payment Method</Text>
        <Text style={styles.infoValue}>
          {displayCoin?.getDisplayName ? displayCoin.getDisplayName() : displayCoin?.name || 'N/A'}
        </Text>
      </View>

      {/* QR Code */}
      <QRCodeDisplay value={paymentData.qrData || paymentData.address} />

      {/* Address Copy */}
      <AddressCopy address={paymentData.address} />

      {/* Payment Status */}
      <PaymentStatus status={status} remainingTime={remainingTime} />

      {/* Transaction Hash if confirmed */}
      {payment?.txHash && (
        <View style={styles.txCard}>
          <Text style={styles.txLabel}>Transaction Hash</Text>
          <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">
            {payment.txHash}
          </Text>
        </View>
      )}

      {/* Print Receipt Button */}
      <TouchableOpacity
        style={[styles.printButton, printing && styles.printButtonDisabled]}
        onPress={handlePrintReceipt}
        disabled={printing}
      >
        {printing ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <>
            <Text style={styles.printButtonIcon}>🖨️</Text>
            <Text style={styles.printButtonText}>Print Receipt</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Dev only: Simulate paid (no real crypto sent) */}
      {__DEV__ && status === 'pending' && (
        <TouchableOpacity
          style={[styles.simulateButton, simulating && styles.printButtonDisabled]}
          onPress={handleSimulatePaid}
          disabled={simulating}
        >
          {simulating ? (
            <ActivityIndicator size="small" color={COLORS.textSecondary} />
          ) : (
            <Text style={styles.simulateButtonText}>Simulate paid</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonSecondaryText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNewPayment}
        >
          <Text style={styles.buttonPrimaryText}>New Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
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
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.text,
  },
  txCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  txLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  txHash: {
    fontSize: FONT_SIZES.small,
    fontFamily: 'monospace',
    color: COLORS.text,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  buttonPrimaryText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 8,
  },
  printButtonDisabled: {
    opacity: 0.6,
  },
  printButtonIcon: {
    fontSize: 20,
  },
  printButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  simulateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  simulateButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.medium,
    fontWeight: '500',
  },
});

export default PaymentDisplayScreen;

