import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ReceiptService from '../../services/ReceiptService';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * PaymentSuccessScreen
 * Displays success message after payment confirmation
 * Matches OMARA Pay POS success screen from video
 */
const PaymentSuccessScreen = ({ route, navigation }) => {
  const { payment, method, amount, usdAmount, phoneNumber, txHash, securityCode } = route.params || {};
  const { cashier, company } = useAuth();
  const [printing, setPrinting] = useState(false);

  const handleVerifyTransaction = () => {
    if (!txHash) {
      Alert.alert('No Transaction Hash', 'Transaction hash is not available yet.');
      return;
    }

    // Open blockchain explorer based on method
    let explorerUrl = '';
    const hash = txHash;

    if (method.methodCode === 'btc' || method.id === 'btc') {
      explorerUrl = `https://blockstream.info/tx/${hash}`;
    } else if (method.methodCode === 'eth' || method.id === 'eth') {
      explorerUrl = `https://etherscan.io/tx/${hash}`;
    } else if (method.methodCode === 'trx' || method.id === 'trx') {
      explorerUrl = `https://tronscan.org/#/transaction/${hash}`;
    } else {
      // Default to blockchair or similar
      explorerUrl = `https://blockchair.com/search?q=${hash}`;
    }

    Linking.openURL(explorerUrl).catch((err) => {
      Alert.alert('Error', 'Could not open blockchain explorer.');
      console.error('Error opening URL:', err);
    });
  };

  const handleNewTransaction = () => {
    // Navigate back to payment method selection
    navigation.reset({
      index: 0,
      routes: [{ name: 'PaymentMethod' }],
    });
  };

  const handlePrintReceipt = async () => {
    try {
      setPrinting(true);
      
      const receiptData = ReceiptService.generateReceiptData({
        payment,
        method,
        amount,
        usdAmount,
        phoneNumber,
        securityCode,
        companyName: company?.name,
        cashierName: cashier?.name,
        txHash,
      });

      await ReceiptService.printReceipt(receiptData);
    } catch (error) {
      Alert.alert('Error', 'Failed to print receipt. Please try again.');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Icon */}
      <View style={styles.successIconContainer}>
        <Text style={styles.successIcon}>✅</Text>
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.successTitle}>Successful Payment!</Text>
        <Text style={styles.successSubtitle}>
          Congratulations! Your payment is successful.
        </Text>
      </View>

      {/* Payment Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Payment Details</Text>

        {usdAmount && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount (USD):</Text>
            <Text style={styles.detailValue}>${usdAmount.toFixed(2)}</Text>
          </View>
        )}

        {amount && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount ({method.symbol || method.name}):</Text>
            <Text style={styles.detailValue}>
              {typeof amount === 'number' ? amount.toFixed(8) : amount} {method.symbol || ''}
            </Text>
          </View>
        )}

        {method && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{method.name || method.symbol}</Text>
          </View>
        )}

        {phoneNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number:</Text>
            <Text style={styles.detailValue}>{phoneNumber}</Text>
          </View>
        )}

        {payment?.paymentId && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID:</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
              {payment.paymentId}
            </Text>
          </View>
        )}

        {txHash && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Hash:</Text>
            <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">
              {txHash}
            </Text>
          </View>
        )}
      </View>

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

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {txHash && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleVerifyTransaction}
          >
            <Text style={styles.buttonSecondaryText}>
              Verify transaction on blockchain
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNewTransaction}
        >
          <Text style={styles.buttonPrimaryText}>New transaction</Text>
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
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 80,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailsTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  txHash: {
    fontSize: FONT_SIZES.small,
    fontFamily: 'monospace',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
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
});

export default PaymentSuccessScreen;
