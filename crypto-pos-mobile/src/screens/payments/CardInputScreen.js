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
  Keyboard,
} from 'react-native';
import { COLORS, FONT_SIZES } from '../../utils/config';

const formatCardNumber = (value) => value
  .replace(/\D/g, '')
  .slice(0, 19)
  .replace(/(\d{4})(?=\d)/g, '$1 ')
  .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return digits.length >= 12 && sum % 10 === 0;
};

const detectBrand = (number) => {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^62/.test(digits)) return 'unionpay';
  return 'card';
};

const CardInputScreen = ({ route, navigation }) => {
  const { method, amount } = route.params || {};
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const detectedBrand = useMemo(() => detectBrand(cardNumber), [cardNumber]);

  const validateForm = () => {
    const rawCardNumber = cardNumber.replace(/\s/g, '');
    const [monthRaw, yearRaw] = expiry.split('/');
    const month = parseInt(monthRaw, 10);
    const year = parseInt(yearRaw, 10);

    if (!luhnCheck(rawCardNumber)) {
      return { valid: false, message: 'Enter a valid card number.' };
    }
    if (!cardholderName.trim() || cardholderName.trim().length < 2) {
      return { valid: false, message: 'Enter the cardholder name.' };
    }
    if (!month || month < 1 || month > 12 || !yearRaw || yearRaw.length !== 2) {
      return { valid: false, message: 'Enter a valid expiry date (MM/YY).' };
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return { valid: false, message: 'Enter a valid CVV.' };
    }

    const now = new Date();
    const fullYear = 2000 + year;
    const expiryDate = new Date(fullYear, month, 0, 23, 59, 59, 999);
    if (expiryDate < now) {
      return { valid: false, message: 'Card is expired.' };
    }

    return {
      valid: true,
      cardData: {
        method: method || null,
        amount: parseFloat(amount),
        cardNumber: rawCardNumber,
        cardholderName: cardholderName.trim(),
        expiryMonth: String(month).padStart(2, '0'),
        expiryYear: String(fullYear),
        cvv,
        last4: rawCardNumber.slice(-4),
        brand: detectedBrand,
      },
    };
  };

  const handleContinue = () => {
    Keyboard.dismiss();
    const validation = validateForm();
    if (!validation.valid) {
      Alert.alert('Invalid Card Data', validation.message);
      return;
    }

    navigation.navigate('CardDetails', {
      method,
      amount,
      cardData: validation.cardData,
    });
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
        <Text style={styles.title}>Card Input</Text>
        <Text style={styles.note}>Enter card details securely.</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Amount: ${parseFloat(amount || 0).toFixed(2)}</Text>
          <Text style={styles.summaryText}>Method: {method?.name || 'Card'}</Text>
          <Text style={styles.summaryText}>Detected brand: {detectedBrand.toUpperCase()}</Text>
        </View>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(value) => setCardNumber(formatCardNumber(value))}
          keyboardType="number-pad"
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={COLORS.textSecondary}
          maxLength={23}
        />

        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="Full name"
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Expiry (MM/YY)</Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={(value) => setExpiry(formatExpiry(value))}
              keyboardType="number-pad"
              placeholder="MM/YY"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={5}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              placeholder="123"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primary,
              (!cardNumber || !cardholderName || !expiry || !cvv) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!cardNumber || !cardholderName || !expiry || !cvv}
          >
            <Text style={styles.buttonText}>Review Payment</Text>
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
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    marginBottom: 6,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
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
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingHorizontal: 0,
    marginTop: 8,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  note: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
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

export default CardInputScreen;
