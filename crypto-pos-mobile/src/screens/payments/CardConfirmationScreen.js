import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * CardConfirmationScreen
 * Collects amount before card payment input
 */
const CardConfirmationScreen = ({ route, navigation }) => {
  const { method } = route.params || {};
  const [amount, setAmount] = useState('');

  const methodLabel = useMemo(
    () => method?.name || method?.symbol || 'Card',
    [method]
  );

  const validateAmount = (value) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return { valid: false, message: 'Please enter a valid amount greater than 0.' };
    }
    return { valid: true, value: parsed };
  };

  const handleContinue = () => {
    Keyboard.dismiss();
    const result = validateAmount(amount);
    if (!result.valid) {
      Alert.alert('Invalid Amount', result.message);
      return;
    }

    navigation.navigate('CardInput', {
      method,
      amount: result.value,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.content}>
        <View style={styles.comingSoonBanner}>
          <Text style={styles.comingSoonText}>Card payment is planned for a future release (see IMPLEMENTATION_PLAN Phase 5).</Text>
        </View>
        <Text style={styles.title}>Card Payment</Text>
        <Text style={styles.subtitle}>{methodLabel}</Text>
        <Text style={styles.note}>
          Enter the bill amount to continue.
        </Text>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Amount (USD)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primary, !amount.trim() && styles.disabled]}
            onPress={handleContinue}
            disabled={!amount.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 8,
  },
  note: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  comingSoonBanner: {
    backgroundColor: COLORS.primary + '18',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  comingSoonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  inputCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
  },
  prefix: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '700',
    color: COLORS.text,
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
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

export default CardConfirmationScreen;
