import React from 'react';

/**
 * Route Configuration Documentation
 * 
 * This file serves as the central documentation for the application's routing structure.
 * It defines route groups, guard types, and access requirements.
 */

export const ROUTE_GUARDS = {
  PUBLIC: 'public',         // No authentication required
  AUTH_ONLY: 'auth',        // Authentication required (Login/Register pages)
  PROTECTED: 'protected',   // Authenticated users only
  ADMIN: 'admin',           // Admin wallet whitelist only
  MERCHANT: 'merchant',     // Merchant role only
  CHAIN: 'chain_select',    // Requires blockchain selection
};

export const ROUTES = {
  // Public Routes
  HOME: { path: '/', guard: ROUTE_GUARDS.PUBLIC, description: 'Landing page' },
  SERVICES: { path: '/services', guard: ROUTE_GUARDS.PUBLIC, description: 'Services overview' },
  ABOUT: { path: '/about', guard: ROUTE_GUARDS.PUBLIC, description: 'About company' }, // Placeholder
  CONTACT: { path: '/contact', guard: ROUTE_GUARDS.PUBLIC, description: 'Contact form' },
  AI_ASSISTANT: { path: '/ai-assistant', guard: ROUTE_GUARDS.PUBLIC, description: 'Public AI chat' },
  BUSINESS_LOCATOR: { path: '/business-locator', guard: ROUTE_GUARDS.PUBLIC, description: 'Store finder' },

  // Authentication Routes
  LOGIN: { path: '/login', guard: ROUTE_GUARDS.AUTH_ONLY, description: 'User login portal' },
  REGISTER: { path: '/register', guard: ROUTE_GUARDS.AUTH_ONLY, description: 'User registration portal' },
  ADMIN_LOGIN: { path: '/admin/login', guard: ROUTE_GUARDS.AUTH_ONLY, description: 'Admin login portal' },

  // Protected User Routes
  BUSINESS_REGISTRATION: { path: '/business-registration', guard: ROUTE_GUARDS.PROTECTED, description: 'Upgrade to merchant' },
  CHAIN_SELECTION: { path: '/chain-selection', guard: ROUTE_GUARDS.PROTECTED, description: 'Select blockchain network' },
  DASHBOARD: { path: '/dashboard', guard: ROUTE_GUARDS.CHAIN, description: 'User/Merchant Dashboard root' },
  
  // Admin Routes (Prefix /admin)
  ADMIN_DASHBOARD: { path: '/admin/dashboard', guard: ROUTE_GUARDS.ADMIN, description: 'Super Admin Dashboard' },
  
  // Wallet Routes (Prefix /wallet)
  WALLET: { path: '/wallet', guard: ROUTE_GUARDS.CHAIN, description: 'Wallet overview' },
};

export const routeGroups = {
  publicRoutes: [
    ROUTES.HOME, ROUTES.SERVICES, ROUTES.CONTACT, ROUTES.AI_ASSISTANT, ROUTES.BUSINESS_LOCATOR
  ],
  authRoutes: [
    ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.ADMIN_LOGIN
  ],
  protectedRoutes: [
    ROUTES.BUSINESS_REGISTRATION, ROUTES.CHAIN_SELECTION
  ],
  walletRoutes: [
    ROUTES.DASHBOARD, ROUTES.WALLET
  ],
  adminRoutes: [
    ROUTES.ADMIN_DASHBOARD
  ]
};

export default ROUTES;