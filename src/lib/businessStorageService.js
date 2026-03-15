import { v4 as uuidv4 } from 'uuid';

const MERCHANTS_STORAGE_KEY = 'omara_merchants';
const USER_UUID_KEY = 'omara_user_uuid';
const DEFAULT_ADMIN_NOTE = "Welcome to Omara! Your merchant account is bound to your wallet.";

/**
 * Business Storage Service
 * Manages strict UUID -> Wallet -> MID hierarchy for merchant data.
 */
export const businessStorageService = {
  
  /**
   * Generates or retrieves a persistent User UUID
   */
  generateUserUUID: () => {
    let uuid = localStorage.getItem(USER_UUID_KEY);
    if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem(USER_UUID_KEY, uuid);
    }
    return uuid;
  },

  /**
   * Retrieves the entire merchant storage object
   */
  getStorage: () => {
      try {
          const data = localStorage.getItem(MERCHANTS_STORAGE_KEY);
          return data ? JSON.parse(data) : {};
      } catch (e) {
          console.error("Failed to parse merchant storage", e);
          return {};
      }
  },

  /**
   * Saves the entire merchant storage object
   */
  saveStorage: (data) => {
      localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Creates a new business record with strict UUID-Wallet binding
   */
  createBusiness: (formData, walletAddress, signature) => {
    try {
      if (!walletAddress) throw new Error("Wallet address is required.");
      if (!signature) throw new Error("Cryptographic signature is required.");
      
      const uuid = businessStorageService.generateUserUUID();
      const mid = `MERCH-${uuidv4().substring(0, 8).toUpperCase()}`;
      const timestamp = new Date().toISOString();
      
      // Structure: { [UUID]: { [walletAddress]: { [MID]: merchantData } } }
      const storage = businessStorageService.getStorage();
      
      if (!storage[uuid]) storage[uuid] = {};
      if (!storage[uuid][walletAddress]) storage[uuid][walletAddress] = {};

      const newMerchant = {
        merchantId: mid, // MID
        uuid: uuid,
        walletAddress: walletAddress,
        signature: signature,
        signedAt: timestamp,
        
        // Business Data
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessCountry: formData.businessCountry || 'Philippines',
        businessRegistrationNumber: formData.businessRegistrationNumber || 'N/A',
        businessOperationType: formData.businessOperationType,
        businessWebsiteUrl: formData.businessWebsiteUrl,
        businessFacebookPage: formData.businessFacebookPage,
        
        // Owner Data
        ownerFirstName: formData.ownerFirstName,
        ownerLastName: formData.ownerLastName,
        ownerMobileNumber: formData.ownerMobileNumber,
        ownerResidentialAddress: formData.ownerResidentialAddress,
        
        // Meta
        status: 'ACTIVE',
        createdAt: timestamp,
        updatedAt: timestamp,
        adminNotes: DEFAULT_ADMIN_NOTE
      };

      storage[uuid][walletAddress][mid] = newMerchant;
      businessStorageService.saveStorage(storage);

      return newMerchant;
    } catch (error) {
      console.error("Business creation failed:", error);
      throw error;
    }
  },

  /**
   * Retrieves all merchants for a specific UUID and Wallet combination
   */
  getMerchantsByUUIDAndWallet: (uuid, walletAddress) => {
    if (!uuid || !walletAddress) return [];
    
    const storage = businessStorageService.getStorage();
    const userWalletData = storage[uuid]?.[walletAddress];
    
    if (!userWalletData) return [];
    return Object.values(userWalletData);
  },

  /**
   * Retrieves a specific merchant by MID, ensuring it matches UUID and Wallet
   */
  getMerchantByMID: (uuid, walletAddress, mid) => {
      const merchants = businessStorageService.getMerchantsByUUIDAndWallet(uuid, walletAddress);
      return merchants.find(m => m.merchantId === mid) || null;
  },

  /**
   * Validates if a user has access to a specific merchant
   */
  validateMerchantAccess: (uuid, walletAddress, mid) => {
      const merchant = businessStorageService.getMerchantByMID(uuid, walletAddress, mid);
      return !!merchant;
  },

  /**
   * Verifies the stored signature (Placeholder for actual crypto verification logic)
   * In a real app, this would use ethers.utils.verifyMessage
   */
  verifySignature: (signature, walletAddress) => {
      // Logic to recover address from signature would go here
      // For this frontend-demo, we assume if signature exists and is tied to wallet in storage, it's valid
      return !!signature && !!walletAddress;
  }
};