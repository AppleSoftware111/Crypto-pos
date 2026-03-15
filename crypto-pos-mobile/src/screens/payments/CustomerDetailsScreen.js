import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * CustomerDetailsScreen
 * Collects customer phone number for payment
 */
const CustomerDetailsScreen = ({ route, navigation }) => {
  const { method, amount, cryptoAmount, rate } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validatePhoneNumber = (phone) => {
    // Basic validation - allow international format
    const cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    if (cleaned.length < 7) {
      return { valid: false, error: 'Please enter a valid phone number' };
    }
    return { valid: true, value: cleaned };
  };

  const handleContinue = () => {
    Keyboard.dismiss();

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      Alert.alert('Invalid Phone Number', validation.error);
      return;
    }

    // Navigate to security code screen
    navigation.navigate('SecurityCode', {
      method,
      amount,
      cryptoAmount,
      rate,
      phoneNumber: validation.value,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Phone number</Text>
          <Text style={styles.subtitle}>Enter customer's phone number</Text>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryValue}>${amount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cryptocurrency:</Text>
            <Text style={styles.summaryValue}>
              {cryptoAmount.toFixed(8)} {method.symbol || method.name}
            </Text>
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Customer Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>+</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="63 917 123 4567"
              placeholderTextColor={COLORS.textSecondary}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoFocus={true}
              editable={!loading}
            />
          </View>
          <Text style={styles.hint}>
            Include country code (e.g., +63 for Philippines)
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.buttonSecondaryText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              (loading || !phoneNumber.trim()) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading || !phoneNumber.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonPrimaryText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  prefix: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 16,
    minHeight: 56,
  },
  hint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
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
  buttonDisabled: {
    opacity: 0.6,
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
});

export default CustomerDetailsScreen;
