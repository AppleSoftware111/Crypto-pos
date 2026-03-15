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
  Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { loginCompany } from '../../api/endpoints';
import { getApiBaseURL, setApiBaseURL } from '../../api/apiClient';
import { getServerUrlOverride, setServerUrlOverride } from '../../utils/storage';
import { COLORS, FONT_SIZES } from '../../utils/config';

/**
 * CompanyLoginScreen
 * First step of two-level authentication
 * Requires company password to proceed
 */
const CompanyLoginScreen = ({ navigation }) => {
  const { loginCompany: loginCompanyContext } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showServerUrlModal, setShowServerUrlModal] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState('');
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const openServerUrlModal = async () => {
    const current = await getServerUrlOverride();
    const fallback = getApiBaseURL() || 'http://10.0.2.2:4000';
    setServerUrlInput(current || fallback);
    setShowServerUrlModal(true);
  };

  const saveServerUrl = async () => {
    const url = serverUrlInput.trim();
    if (!url) {
      Alert.alert('Error', 'Enter a valid URL (e.g. http://192.168.1.100:4000)');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      Alert.alert('Error', 'URL must start with http:// or https://');
      return;
    }
    await setServerUrlOverride(url);
    setApiBaseURL(url);
    setShowServerUrlModal(false);
    Alert.alert('Server URL updated', 'Try logging in again.');
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter company password');
      return;
    }

    try {
      setLoading(true);

      const response = await loginCompany(password);

      // Store company auth in context
      const success = await loginCompanyContext(
        response.token,
        response.company
      );

      if (success) {
        // Navigate to cashier selection
        navigation.replace('CashierSelection', {
          companyId: response.company.id,
          companyName: response.company.name,
        });
      } else {
        Alert.alert('Error', 'Failed to store authentication data');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid company password. Please try again.',
        [{ text: 'OK' }]
      );
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
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔒</Text>
          <Text style={styles.title}>OMARA Pay POS</Text>
          <Text style={styles.subtitle}>Company Login</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Company Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Enter company password"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text style={styles.eyeButtonText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading || !password.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure POS Terminal System
          </Text>
          <TouchableOpacity
            onPress={openServerUrlModal}
            style={styles.serverUrlLink}
            disabled={loading}
          >
            <Text style={styles.serverUrlLinkText}>Set server URL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showServerUrlModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServerUrlModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Server URL</Text>
            <Text style={styles.modalHint}>
              Emulator: http://10.0.2.2:4000{'\n'}
              Physical device: http://YOUR_PC_IP:4000
            </Text>
            <TextInput
              style={styles.modalInput}
              value={serverUrlInput}
              onChangeText={setServerUrlInput}
              placeholder="http://192.168.1.100:4000"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowServerUrlModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveServerUrl}
              >
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    paddingVertical: 16,
    minHeight: 56,
  },
  eyeButton: {
    padding: 8,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  serverUrlLink: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  serverUrlLinkText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalHint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  modalButtonCancelText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  modalButtonSave: {
    backgroundColor: COLORS.primary,
  },
  modalButtonSaveText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
});

export default CompanyLoginScreen;
