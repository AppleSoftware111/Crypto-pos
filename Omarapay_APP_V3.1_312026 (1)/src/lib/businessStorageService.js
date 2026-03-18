import { v4 as uuidv4 } from 'uuid';
import { REGISTRATION_STATUS } from '@/lib/businessSchema';

const MERCHANTS_STORAGE_KEY = 'omara_merchants';
const USER_UUID_KEY = 'omara_user_uuid';
const MERCHANTS_WALLET_MIGRATED_KEY = 'omara_merchants_wallet_lowercase_migrated';
const DEFAULT_ADMIN_NOTE = "Welcome to Omara! Your merchant account is bound to your wallet.";

/** Normalize wallet address for storage keys so reconnects (any casing) find the same data */
const normalizeWalletKey = (walletAddress) => (walletAddress || '').toLowerCase();

/**
 * Business Storage Service
 * Manages strict UUID -> Wallet -> MID hierarchy for merchant data.
 * Wallet keys are stored in lowercase so the same wallet always resolves after reconnect.
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
   * One-time migration: re-key wallet addresses to lowercase so lookup is case-insensitive.
   */
  _migrateWalletKeysToLowercase: (storage) => {
      if (typeof localStorage === 'undefined' || localStorage.getItem(MERCHANTS_WALLET_MIGRATED_KEY)) return storage;
      let changed = false;
      for (const uuid of Object.keys(storage)) {
          const byWallet = storage[uuid];
          if (!byWallet || typeof byWallet !== 'object') continue;
          for (const key of Object.keys(byWallet)) {
              const lower = key.toLowerCase();
              if (key === lower) continue;
              const merchants = byWallet[key];
              if (!storage[uuid][lower]) storage[uuid][lower] = { ...merchants };
              else Object.assign(storage[uuid][lower], merchants);
              delete storage[uuid][key];
              changed = true;
          }
      }
      if (changed) {
          try {
              localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(storage));
              localStorage.setItem(MERCHANTS_WALLET_MIGRATED_KEY, 'true');
          } catch (e) {
              console.warn("Merchant storage migration save failed", e);
          }
      } else {
          localStorage.setItem(MERCHANTS_WALLET_MIGRATED_KEY, 'true');
      }
      return storage;
  },

  /**
   * Retrieves the entire merchant storage object (runs one-time lowercase migration if needed)
   */
  getStorage: () => {
      try {
          const data = localStorage.getItem(MERCHANTS_STORAGE_KEY);
          const storage = data ? JSON.parse(data) : {};
          return businessStorageService._migrateWalletKeysToLowercase(storage);
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

      const walletKey = normalizeWalletKey(walletAddress);
      const uuid = businessStorageService.generateUserUUID();
      const mid = `MERCH-${uuidv4().substring(0, 8).toUpperCase()}`;
      const timestamp = new Date().toISOString();

      // Structure: { [UUID]: { [walletKey (lowercase)]: { [MID]: merchantData } } }
      const storage = businessStorageService.getStorage();

      if (!storage[uuid]) storage[uuid] = {};
      if (!storage[uuid][walletKey]) storage[uuid][walletKey] = {};

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
        status: REGISTRATION_STATUS.AWAITING_ADMIN_REVIEW,
        createdAt: timestamp,
        updatedAt: timestamp,
        adminNotes: DEFAULT_ADMIN_NOTE
      };

      storage[uuid][walletKey][mid] = newMerchant;
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

    const walletKey = normalizeWalletKey(walletAddress);
    const storage = businessStorageService.getStorage();
    const userWalletData = storage[uuid]?.[walletKey];

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
  },

  /**
   * Returns all merchants pending admin review (AWAITING_ADMIN_REVIEW or AWAITING_DOCUMENTS).
   * Flat array with businessId alias for AdminBusinessApprovalPage compatibility.
   */
  getAllMerchantsForAdmin: () => {
    const storage = businessStorageService.getStorage();
    const result = [];
    for (const uuid of Object.keys(storage)) {
      for (const walletAddress of Object.keys(storage[uuid] || {})) {
        const walletData = storage[uuid][walletAddress];
        for (const mid of Object.keys(walletData || {})) {
          const m = walletData[mid];
          if (m.status === REGISTRATION_STATUS.AWAITING_ADMIN_REVIEW || m.status === REGISTRATION_STATUS.AWAITING_DOCUMENTS) {
            result.push({
              ...m,
              businessId: m.merchantId,
              submittedAt: m.createdAt,
              documents: m.documents || [],
              documentsCount: (m.documents && m.documents.length) || 0,
              address: m.address || { formatted: m.ownerResidentialAddress || m.businessCountry || '' }
            });
          }
        }
      }
    }
    return result;
  },

  /**
   * Finds a merchant by merchantId across the whole storage. Returns { merchant, uuid, walletAddress } or null.
   */
  findMerchantByMid: (merchantId) => {
    const storage = businessStorageService.getStorage();
    for (const uuid of Object.keys(storage)) {
      for (const walletAddress of Object.keys(storage[uuid] || {})) {
        const walletData = storage[uuid][walletAddress];
        for (const mid of Object.keys(walletData || {})) {
          if (mid === merchantId) {
            return { merchant: walletData[mid], uuid, walletAddress };
          }
        }
      }
    }
    return null;
  },

  /**
   * Updates a merchant's status and optional fields (rejectionReason, adminNotes, approvedAt, riskLevel).
   */
  updateMerchantStatus: (uuid, walletAddress, merchantId, newStatus, extra = {}) => {
    const walletKey = normalizeWalletKey(walletAddress);
    const storage = businessStorageService.getStorage();
    const merchant = storage[uuid]?.[walletKey]?.[merchantId];
    if (!merchant) return;
    const timestamp = new Date().toISOString();
    storage[uuid][walletKey][merchantId] = {
      ...merchant,
      status: newStatus,
      updatedAt: timestamp,
      ...(extra.rejectionReason !== undefined && { rejectionReason: extra.rejectionReason }),
      ...(extra.adminNotes !== undefined && { adminNotes: extra.adminNotes }),
      ...(extra.approvedAt !== undefined && { approvedAt: extra.approvedAt }),
      ...(extra.riskLevel !== undefined && { riskLevel: extra.riskLevel })
    };
    businessStorageService.saveStorage(storage);
  }
};