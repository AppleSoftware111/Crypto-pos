import { formatReceipt, generateReceiptHTML } from '../utils/receiptTemplate';
import { getReceiptData } from '../api/endpoints';
import { Alert } from 'react-native';
import SmartPosPrinterService from './SmartPosPrinterService';

/**
 * Receipt Service
 * Handles receipt generation and printing
 */
class ReceiptService {
  /**
   * Generate receipt data from payment information
   */
  generateReceiptData(paymentData) {
    const {
      payment,
      method,
      amount,
      usdAmount,
      phoneNumber,
      securityCode,
      rate,
      companyName,
      cashierName,
    } = paymentData;

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    return {
      companyName: companyName || 'OMARA Pay',
      cashierName: cashierName || 'Cashier',
      paymentId: payment?.paymentId || payment?.id || 'N/A',
      date,
      time,
      amount: usdAmount || amount,
      cryptoAmount: amount,
      method: method?.name || method?.methodCode || 'N/A',
      symbol: method?.symbol || '',
      address: payment?.address || paymentData?.address,
      phoneNumber,
      securityCode,
      txHash: payment?.txHash || paymentData?.txHash,
      status: payment?.status || 'pending',
      qrData: paymentData?.qrData || paymentData?.paymentData?.qrData,
    };
  }

  /**
   * Format receipt text for thermal printer
   */
  formatReceiptText(receiptData) {
    return formatReceipt(receiptData);
  }

  /**
   * Generate receipt HTML for preview/PDF
   */
  generateReceiptHTML(receiptData) {
    return generateReceiptHTML(receiptData);
  }

  /**
   * Print receipt using SmartPOS printer module on Android.
   * Falls back to preview when SDK/native module is unavailable.
   */
  async printReceipt(receiptData) {
    try {
      const receiptText = this.formatReceiptText(receiptData);
      const available = await SmartPosPrinterService.isAvailable();

      if (!available) {
        Alert.alert(
          'Receipt Preview',
          'SmartPOS SDK not detected. Showing preview instead.\n\n' +
          receiptText.substring(0, 250) +
          '...'
        );
        return { success: true, receiptText, fallback: true };
      }

      await SmartPosPrinterService.initialize();
      await SmartPosPrinterService.printText(receiptText + '\n\n');

      Alert.alert('Print Success', 'Receipt printed successfully.');

      return { success: true, receiptText };
    } catch (error) {
      console.error('Error printing receipt:', error);
      Alert.alert('Print Error', error?.message || 'Failed to print receipt. Please try again.');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get receipt data from server
   */
  async getReceiptData(paymentId) {
    try {
      const data = await getReceiptData(paymentId);
      return data;
    } catch (error) {
      console.error('Error fetching receipt data:', error);
      throw error;
    }
  }

  /**
   * Share receipt (for email, messaging, etc.)
   */
  async shareReceipt(receiptData) {
    try {
      const receiptText = this.formatReceiptText(receiptData);
      
      // TODO: Implement sharing functionality
      // Using expo-sharing or react-native-share
      
      Alert.alert(
        'Share Receipt',
        'Receipt sharing functionality coming soon.',
        [{ text: 'OK' }]
      );

      return { success: true };
    } catch (error) {
      console.error('Error sharing receipt:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ReceiptService();
