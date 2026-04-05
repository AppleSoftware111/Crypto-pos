/**
 * POS (Crypto POS) API configuration for Omarapay dashboard.
 * Points to the Crypto POS backend (same as mobile app).
 */
const POS_API_BASE_URL = import.meta.env.VITE_POS_API_BASE_URL || 'http://localhost:4000';
/** Set to 'false' to hide POS in merchant (business) area. POS is business-account only. */
export const POS_ENABLED = import.meta.env.VITE_SHOW_POS !== 'false';

/**
 * When merging optional client-supplied POS modules, gate them behind this flag
 * and/or separate env URLs so staging can test without affecting production.
 */
export const POS_CLIENT_MODULES_ENABLED = import.meta.env.VITE_POS_CLIENT_MODULES === 'true';

export const getPOSApiBaseUrl = () => POS_API_BASE_URL;

export default { getPOSApiBaseUrl, POS_API_BASE_URL, POS_ENABLED, POS_CLIENT_MODULES_ENABLED };
