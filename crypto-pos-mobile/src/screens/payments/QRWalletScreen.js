import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { createQRWalletPayment } from '../../api/endpoints';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import { COLORS, FONT_SIZES } from '../../utils/config';

const QRWalletScreen = ({ route, navigation }) => {
  const { method } = route.params || {};
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const methodCode = method?.methodCode || method?.method_code || method?.id || 'qr-wallet';
  const methodName = method?.name || 'QR Wallet';
  const parsedAmount = parseFloat(amount);

  const qrPayload = useMemo(() => {
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return null;
    }

    return JSON.stringify({
      type: 'QR_WALLET_PAYMENT',
      method: methodCode,
      methodName,
      amount: parsedAmount.toFixed(2),
      currency: 'USD',
      phoneNumber: phoneNumber || null,
      timestamp: new Date().toISOString(),
    });
  }, [amount, parsedAmount, methodCode, methodName, phoneNumber]);

  const validateAmount = (value) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return { valid: false, message: 'Please enter a valid amount greater than 0.' };
    }
    return { valid: true, value: parsed };
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      Alert.alert('Invalid Amount', amountValidation.message);
      return;
    }

    try {
      setLoading(true);

      const paymentData = await createQRWalletPayment(methodCode, amountValidation.value, {
        phoneNumber: phoneNumber || null,
        methodName,
      });

      navigation.replace('PaymentSuccess', {
        payment: {
          paymentId: paymentData.paymentId,
          status: paymentData.status,
          txHash: paymentData.txHash || null,
          method: paymentData.method || methodCode,
        },
        method: {
          ...method,
          methodCode,
          name: methodName,
        },
        usdAmount: amountValidation.value,
        amount: undefined,
        phoneNumber: phoneNumber || null,
        securityCode: null,
        txHash: paymentData.txHash || null,
      });
    } catch (error) {
      Alert.alert('QR Wallet Payment Failed', error.message || 'Unable to process QR wallet payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.comingSoonBanner}>
          <Text style={styles.comingSoonText}>QR wallet payment is planned for a future release (see IMPLEMENTATION_PLAN Phase 5).</Text>
        </View>
        <Text style={styles.title}>QR Wallet Payment</Text>
        <Text style={styles.subtitle}>{methodName}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Amount (USD)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <Text style={styles.label}>Customer Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="63 917 123 4567"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {qrPayload && (
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>Payment QR Preview</Text>
            <QRCodeDisplay value={qrPayload} size={220} />
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primary,
              (!amount.trim() || loading) && styles.disabled,
            ]}
            onPress={handleSubmit}
            disabled={!amount.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonText}>Confirm Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  comingSoonBanner: {
    backgroundColor: COLORS.primary + '18',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  prefix: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    marginBottom: 12,
    flex: 1,
  },
  amountInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '700',
    paddingVertical: 12,
  },
  qrSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
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
  disabled: {
    opacity: 0.6,
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

export default QRWalletScreen;
