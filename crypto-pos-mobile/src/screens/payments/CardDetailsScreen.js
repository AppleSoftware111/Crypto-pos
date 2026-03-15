import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { createCardPayment } from '../../api/endpoints';
import { COLORS, FONT_SIZES } from '../../utils/config';

const CardDetailsScreen = ({ route, navigation }) => {
  const { method, amount, cardData } = route.params || {};
  const [processing, setProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    try {
      setProcessing(true);

      const response = await createCardPayment(
        method?.methodCode || method?.method_code || method?.id,
        parseFloat(amount),
        {
          cardNumber: cardData?.cardNumber,
          expiryMonth: cardData?.expiryMonth,
          expiryYear: cardData?.expiryYear,
          cvv: cardData?.cvv,
          cardholderName: cardData?.cardholderName,
        }
      );

      navigation.replace('PaymentSuccess', {
        payment: {
          paymentId: response.paymentId,
          status: response.status,
          txHash: null,
          method: response.method,
        },
        method,
        usdAmount: parseFloat(amount),
        amount: undefined,
        phoneNumber: null,
        securityCode: null,
        txHash: null,
      });
    } catch (error) {
      Alert.alert('Card Payment Failed', error.message || 'Unable to process card payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Card Details</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Method</Text>
            <Text style={styles.value}>{method?.name || 'Card'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>${parseFloat(amount || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cardholder</Text>
            <Text style={styles.value}>{cardData?.cardholderName || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Card</Text>
            <Text style={styles.value}>**** **** **** {cardData?.last4 || '----'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expiry</Text>
            <Text style={styles.value}>
              {cardData?.expiryMonth || '--'}/{String(cardData?.expiryYear || '').slice(-2) || '--'}
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          By confirming, the POS will securely process this card payment.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primary, processing && styles.buttonDisabled]}
            onPress={handleConfirmPayment}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonText}>Confirm & Pay</Text>
            )}
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
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '700',
  },
  note: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
});

export default CardDetailsScreen;
