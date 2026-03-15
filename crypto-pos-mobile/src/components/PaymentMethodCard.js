import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../utils/config';

/**
 * PaymentMethodCard Component
 * Grid card for payment methods (optimized for POS devices)
 */
const PaymentMethodCard = ({ method, onPress, baseUrl }) => {
  const [imageError, setImageError] = React.useState(false);

  // Get icon URL if available
  const iconUrl = method.iconUrl || (method.getIconUrl ? method.getIconUrl(baseUrl) : null);
  const isSvgIcon = typeof iconUrl === 'string' && iconUrl.toLowerCase().endsWith('.svg');

  // Get display name
  const displayName = method.getDisplayName ? method.getDisplayName() : method.name;
  const displaySymbol = method.getDisplaySymbol ? method.getDisplaySymbol() : method.symbol;
  const methodKey = String(method?.methodCode || method?.method_code || method?.id || '').toLowerCase();

  const getModernIconConfig = () => {
    const defaultConfig = {
      iconName: 'currency-usd',
      iconColor: '#2C3E50',
      backgroundColor: '#EAF0F6',
      badgeColor: '#2C3E50',
    };

    const map = {
      btc: {
        iconName: 'currency-btc',
        iconColor: '#F7931A',
        backgroundColor: '#FFF3E6',
        badgeColor: '#F7931A',
      },
      avax: {
        iconName: 'alpha-a-circle',
        iconColor: '#E84142',
        backgroundColor: '#FDEBEC',
        badgeColor: '#E84142',
      },
      avax0: {
        iconName: 'alpha-a-circle-outline',
        iconColor: '#C62828',
        backgroundColor: '#FCEAEA',
        badgeColor: '#C62828',
      },
      'usdt-avax': {
        iconName: 'currency-usd',
        iconColor: '#26A17B',
        backgroundColor: '#E8F7F2',
        badgeColor: '#26A17B',
      },
      'usdc-avax': {
        iconName: 'currency-usd',
        iconColor: '#2775CA',
        backgroundColor: '#EAF2FB',
        badgeColor: '#2775CA',
      },
      visa: {
        iconName: 'credit-card-outline',
        iconColor: '#1A1F71',
        backgroundColor: '#E9EDFB',
        badgeColor: '#1A1F71',
      },
      mastercard: {
        iconName: 'credit-card-chip-outline',
        iconColor: '#EB001B',
        backgroundColor: '#FDE9EC',
        badgeColor: '#FF5F00',
      },
      unionpay: {
        iconName: 'credit-card-wireless-outline',
        iconColor: '#D81E06',
        backgroundColor: '#FDEBE9',
        badgeColor: '#0071CE',
      },
      gcash: {
        iconName: 'wallet-outline',
        iconColor: '#0057FF',
        backgroundColor: '#EAF0FF',
        badgeColor: '#0057FF',
      },
      gpay: {
        iconName: 'google',
        iconColor: '#4285F4',
        backgroundColor: '#EDF3FE',
        badgeColor: '#4285F4',
      },
      'apple-pay': {
        iconName: 'apple',
        iconColor: '#1D1D1F',
        backgroundColor: '#F0F0F0',
        badgeColor: '#1D1D1F',
      },
      'wechat-pay': {
        iconName: 'wechat',
        iconColor: '#07C160',
        backgroundColor: '#E9F9EF',
        badgeColor: '#07C160',
      },
      alipay: {
        iconName: 'alpha-a-circle-outline',
        iconColor: '#1677FF',
        backgroundColor: '#E9F2FF',
        badgeColor: '#1677FF',
      },
      'qr-code': {
        iconName: 'qrcode',
        iconColor: '#374151',
        backgroundColor: '#EEF2F7',
        badgeColor: '#374151',
      },
    };

    return map[methodKey] || defaultConfig;
  };

  const iconConfig = getModernIconConfig();
  const badgeText = (displaySymbol || displayName || '').toUpperCase().slice(0, 5);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {iconUrl && !imageError && !isSvgIcon ? (
          <Image
            source={{ uri: iconUrl }}
            style={styles.icon}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            style={[
              styles.iconPlaceholder,
              { backgroundColor: iconConfig.backgroundColor },
            ]}
          >
            <MaterialCommunityIcons
              name={iconConfig.iconName}
              size={34}
              color={iconConfig.iconColor}
            />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {displayName}
      </Text>
      <View style={[styles.badge, { backgroundColor: iconConfig.badgeColor + '14' }]}>
        <Text style={[styles.badgeText, { color: iconConfig.badgeColor }]}>
          {badgeText || 'PAY'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 2,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default PaymentMethodCard;
