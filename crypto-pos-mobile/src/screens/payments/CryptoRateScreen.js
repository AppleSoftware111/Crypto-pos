import React, { useState, useEffect, useRef } from 'react';
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
import { getCryptoRate } from '../../api/endpoints';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * CryptoRateScreen
 * Displays crypto rate box with USD equivalent
 * Rate updates every 20 seconds (as per video)
 */
const CryptoRateScreen = ({ route, navigation }) => {
  const { method } = route.params;
  const methodCode = method?.methodCode || method?.method_code || method?.id || null;
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [cryptoAmount, setCryptoAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(true);
  const inputRef = useRef(null);
  const rateIntervalRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Load initial rate
    loadRate();

    // Set up rate refresh every 20 seconds
    rateIntervalRef.current = setInterval(() => {
      if (amount) {
        loadRate();
      }
    }, 20000); // 20 seconds

    return () => {
      clearTimeout(timer);
      if (rateIntervalRef.current) {
        clearInterval(rateIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reload rate when amount changes
    if (amount && parseFloat(amount) > 0) {
      loadRate();
    } else {
      setCryptoAmount(null);
    }
  }, [amount]);

  const loadRate = async () => {
    if (!methodCode) {
      if (!rate) {
        Alert.alert('Error', 'Invalid cryptocurrency configuration. Missing method code.');
      }
      return;
    }

    try {
      setRateLoading(true);
      const rateData = await getCryptoRate(methodCode, parseFloat(amount) || 100);
      setRate(rateData);
      
      if (amount && parseFloat(amount) > 0) {
        setCryptoAmount(rateData.cryptoAmount);
      }
    } catch (error) {
      console.error('Error loading rate:', error);
      // Don't show error alert on every refresh, just log it
      if (!rate) {
        Alert.alert('Error', error.message || 'Failed to load crypto rate. Please try again.');
      }
    } finally {
      setRateLoading(false);
    }
  };

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return { valid: false, error: 'Please enter a valid amount greater than 0' };
    }
    return { valid: true, value: numValue };
  };

  const handleContinue = () => {
    Keyboard.dismiss();

    const validation = validateAmount(amount);
    if (!validation.valid) {
      Alert.alert('Invalid Amount', validation.error);
      return;
    }

    if (!rate || !cryptoAmount) {
      Alert.alert('Error', 'Please wait for rate to load');
      return;
    }

    // Navigate to customer details
    navigation.navigate('CustomerDetails', {
      method,
      amount: validation.value,
      cryptoAmount,
      rate,
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
          <Text style={styles.title}>Pay by Cryptocurrency</Text>
          <Text style={styles.subtitle}>{method.name || method.symbol}</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter amount of the bill</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus={true}
              editable={!loading}
            />
          </View>
        </View>

        {/* Crypto Rate Box */}
        {amount && parseFloat(amount) > 0 && (
          <View style={styles.rateBox}>
            <View style={styles.rateHeader}>
              <Text style={styles.rateTitle}>Crypto rate box</Text>
              {rateLoading && (
                <ActivityIndicator size="small" color={COLORS.primary} />
              )}
            </View>
            
            {rate && (
              <>
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>Total amount:</Text>
                  <Text style={styles.rateValue}>${parseFloat(amount).toFixed(2)}</Text>
                </View>
                
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>In {method.symbol || method.name}:</Text>
                  <Text style={styles.rateValue}>
                    {cryptoAmount ? cryptoAmount.toFixed(8) : '0.00000000'} {method.symbol || ''}
                  </Text>
                </View>
                
                <View style={styles.rateRow}>
                  <Text style={styles.rateLabel}>In USD rate:</Text>
                  <Text style={styles.rateValue}>${rate.usdRate ? rate.usdRate.toFixed(2) : '0.00'}</Text>
                </View>
                
                <View style={styles.rateNote}>
                  <Text style={styles.rateNoteText}>
                    ⚠️ Rate changes every 20 seconds
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

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
              (loading || !amount || !rate || !cryptoAmount) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading || !amount || !rate || !cryptoAmount}
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
    marginBottom: 32,
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
    paddingHorizontal: 20,
  },
  currencySymbol: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 16,
    minHeight: 70,
  },
  rateBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rateTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  rateValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  rateNote: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rateNoteText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.warning,
    fontStyle: 'italic',
    textAlign: 'center',
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

export default CryptoRateScreen;
