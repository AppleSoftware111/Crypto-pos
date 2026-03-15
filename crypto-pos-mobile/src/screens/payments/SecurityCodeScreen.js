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
import { generateSecurityCode, createPaymentWithMetadata } from '../../api/endpoints';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * SecurityCodeScreen
 * Generates and displays security code valid for 60 seconds
 * User must enter the code to proceed with payment
 */
const SecurityCodeScreen = ({ route, navigation }) => {
  const { method, amount, cryptoAmount, rate, phoneNumber } = route.params;
  const [securityCode, setSecurityCode] = useState('');
  const [displayCode, setDisplayCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [loading, setLoading] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [expired, setExpired] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const codeGenerationRef = useRef(null);

  useEffect(() => {
    // Generate security code on mount
    generateCode();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (codeGenerationRef.current) {
        clearTimeout(codeGenerationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (codeGenerated && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [codeGenerated, timeRemaining]);

  const generateCode = async () => {
    try {
      setLoading(true);
      const response = await generateSecurityCode(phoneNumber);
      setDisplayCode(response.code);
      setSecurityCode(response.code);
      setCodeGenerated(true);
      setTimeRemaining(60);
      setExpired(false);

      // Focus input after code is generated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate security code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    Keyboard.dismiss();

    if (!securityCode.trim()) {
      Alert.alert('Error', 'Please enter the security code');
      return;
    }

    if (expired || timeRemaining === 0) {
      Alert.alert(
        'Code Expired',
        'The security code has expired. Please generate a new one.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate New', onPress: generateCode },
        ]
      );
      return;
    }

    // Verify code matches
    if (securityCode !== displayCode) {
      Alert.alert('Invalid Code', 'The security code does not match. Please try again.');
      return;
    }

    try {
      setLoading(true);

      // Create payment with all details
      const paymentData = await createPaymentWithMetadata(
        method.methodCode || method.id,
        cryptoAmount,
        {
          phoneNumber,
          securityCode,
          usdAmount: amount,
          rate,
        }
      );

      // Navigate to payment display screen
      navigation.navigate('PaymentDisplay', {
        paymentData,
        method,
        amount: cryptoAmount,
        usdAmount: amount,
        phoneNumber,
      });
    } catch (error) {
      Alert.alert(
        'Payment Creation Failed',
        error.message || 'Failed to create payment request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Text style={styles.title}>Security code</Text>
          <Text style={styles.subtitle}>
            Code valid for 60 seconds
          </Text>
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
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phone:</Text>
            <Text style={styles.summaryValue}>{phoneNumber}</Text>
          </View>
        </View>

        {/* Security Code Display */}
        {codeGenerated && !expired && (
          <View style={styles.codeDisplayCard}>
            <Text style={styles.codeDisplayLabel}>Security Code:</Text>
            <Text style={styles.codeDisplayValue}>{displayCode}</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time remaining:</Text>
              <Text
                style={[
                  styles.timerValue,
                  timeRemaining <= 10 && styles.timerValueWarning,
                ]}
              >
                {formatTime(timeRemaining)}
              </Text>
            </View>
          </View>
        )}

        {/* Expired Message */}
        {expired && (
          <View style={styles.expiredCard}>
            <Text style={styles.expiredText}>⚠️ Code Expired</Text>
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={generateCode}
              disabled={loading}
            >
              <Text style={styles.regenerateButtonText}>Generate New Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Security Code Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter Security Code</Text>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              expired && styles.inputExpired,
            ]}
            placeholder="Enter code"
            placeholderTextColor={COLORS.textSecondary}
            value={securityCode}
            onChangeText={setSecurityCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading && !expired}
            autoFocus={codeGenerated}
          />
          {expired && (
            <Text style={styles.expiredHint}>
              Code has expired. Please generate a new one.
            </Text>
          )}
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
              (loading || !securityCode.trim() || expired) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={loading || !securityCode.trim() || expired}
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
  codeDisplayCard: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  codeDisplayLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  codeDisplayValue: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  timerValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  timerValueWarning: {
    color: COLORS.error,
  },
  expiredCard: {
    backgroundColor: COLORS.error + '20',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  expiredText: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 12,
  },
  regenerateButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  regenerateButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
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
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 4,
    minHeight: 70,
  },
  inputExpired: {
    borderColor: COLORS.error,
    opacity: 0.5,
  },
  expiredHint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.error,
    marginTop: 8,
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

export default SecurityCodeScreen;
