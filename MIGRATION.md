# Supabase Migration Guide

This project has been migrated from local storage and wallet-only authentication to a robust Supabase backend.

## 1. Database Schema

The database consists of the following core tables in the `public` schema:

- **users**: Extends Supabase Auth `auth.users`. Stores profile info and wallet addresses.
- **business_profiles**: Stores merchant business details.
- **documents**: Tracks uploaded files (KYC/KYB).
- **transactions**: Ledger for fiat and crypto transactions.
- **wallets**, **ewallets**, **bank_information**: Payment methods.

## 2. Row Level Security (RLS)

Security is enforced at the database level:
- Users can only access their own data (`auth.uid() = user_id`).
- Admins (role='admin') have full access to view and manage data.
- Public access is disabled by default.

## 3. Storage

Three buckets are configured:
- `documents` (Private): For sensitive KYC/Business docs.
- `profile-pictures` (Public): For user avatars.
- `business-logos` (Public): For merchant branding.

## 4. Environment Setup

Ensure your `.env` or environment configuration includes:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are initialized in `src/lib/customSupabaseClient.js`.

## 5. Migration Utility

A migration utility `src/services/supabaseDataMigration.js` is included.
It automatically triggers when a user connects their wallet for the first time after logging in with Supabase, attempting to sync local storage data to the cloud.

## 6. Usage

### Auth