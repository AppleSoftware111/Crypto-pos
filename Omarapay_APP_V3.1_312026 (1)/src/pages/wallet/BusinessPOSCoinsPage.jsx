import React from 'react';
import AdminPOSCoinsPage from '@/pages/admin/AdminPOSCoinsPage';

/**
 * POS Coin Settings for business users (central control).
 * Changes made here apply to the POS device and Accept Payments flow.
 */
export default function BusinessPOSCoinsPage() {
  return (
    <AdminPOSCoinsPage
      pageTitle="POS Coin Settings"
      pageSubtitle="Manage coins for your POS. Changes apply to the device and Accept Payments."
    />
  );
}
