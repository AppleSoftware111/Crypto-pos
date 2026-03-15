// Data structures and schemas for Business Registration and Payment Providers
import { v4 as uuidv4 } from 'uuid';

export const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Corporation",
  "LLC",
  "Cooperative",
  "Non-Profit"
];

export const REGISTRATION_STATUS = {
  PENDING_KYB: "PENDING_KYB", // Initial profile created, documents missing/pending (Legacy/Internal)
  PENDING_KYC: "PENDING_KYC", // Profile submitted, waiting for documents (Step 1 complete) or Additional Docs Requested
  AWAITING_ADMIN_REVIEW: "AWAITING_ADMIN_REVIEW", // Documents submitted (Step 2 complete)
  AWAITING_DOCUMENTS: "AWAITING_DOCUMENTS", // Admin requested more info
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
  INCOMPLETE: "INCOMPLETE"
};

export const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

export const DEFAULT_PAYMENT_PROVIDERS = [
  {
    id: "maya",
    name: "Maya",
    type: "E-WALLET",
    enabled: true,
    feePercentage: 2.0,
    feeFixed: 0,
    dailyLimit: 50000,
    monthlyLimit: 500000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Maya_logo.svg/1200px-Maya_logo.svg.png" 
  },
  {
    id: "gcash",
    name: "GCash",
    type: "E-WALLET",
    enabled: true,
    feePercentage: 2.5,
    feeFixed: 15,
    dailyLimit: 100000,
    monthlyLimit: 500000,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/GCash_logo.svg/1200px-GCash_logo.svg.png"
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    type: "BANK",
    enabled: true,
    feePercentage: 0,
    feeFixed: 50, // PHP
    dailyLimit: 500000,
    monthlyLimit: 5000000,
    logo: null
  },
  {
    id: "crypto_usdt",
    name: "USDT Deposit",
    type: "CRYPTO",
    enabled: true,
    feePercentage: 0.5,
    feeFixed: 1, // USD
    dailyLimit: 100000, // USD
    monthlyLimit: 1000000, // USD
    logo: null
  }
];

/**
 * Creates a new business profile object.
 * @param {string} walletAddress - Owner's wallet address
 * @param {Object} data - Form data
 * @param {Object} data.address - Nested address object { lat, lng, placeId, formatted, line1, city, state, postalCode, country }
 */
export const createBusinessProfile = (walletAddress, data) => ({
  id: `BUS-${uuidv4()}`,
  businessId: uuidv4(), // Explicit UUID as requested
  walletAddress,
  
  // Basic Info
  name: data.name,
  businessName: data.name, // Mapping for consistency
  type: data.type,
  businessType: data.type, // Mapping for consistency
  email: data.email,
  phone: data.phone,
  registrationNumber: data.registrationNumber,
  dateOfRegistration: data.registrationDate,
  
  // Location Data - Nested Address Object
  country: data.country,
  address: data.address, // Expects normalized address object
  
  // Legacy fields for backward compatibility, mapped from nested address
  latitude: data.address?.lat,
  longitude: data.address?.lng,
  
  // Status & Meta
  status: REGISTRATION_STATUS.PENDING_KYC,
  riskLevel: null, // Set by admin
  documents: [],
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  approvedAt: null,
  
  // Admin Notes
  rejectionReason: null,
  suspensionReason: null,
  adminNotes: null
});