import { NativeModules, Platform } from 'react-native';

const { SmartPosPrinter } = NativeModules;

class SmartPosPrinterService {
  async isAvailable() {
    if (Platform.OS !== 'android' || !SmartPosPrinter?.isAvailable) {
      return false;
    }

    try {
      return await SmartPosPrinter.isAvailable();
    } catch (error) {
      console.error('SmartPos availability check failed:', error);
      return false;
    }
  }

  async initialize() {
    if (Platform.OS !== 'android' || !SmartPosPrinter?.initialize) {
      throw new Error('SmartPosPrinter native module is not available.');
    }
    return SmartPosPrinter.initialize();
  }

  async printText(text) {
    if (Platform.OS !== 'android' || !SmartPosPrinter?.printText) {
      throw new Error('SmartPosPrinter native module is not available.');
    }
    return SmartPosPrinter.printText(text);
  }
}

export default new SmartPosPrinterService();
