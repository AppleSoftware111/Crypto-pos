import { Smartphone, Wallet, QrCode } from 'lucide-react';

export const ewalletConfig = {
  PH: [
    { id: 'gcash', name: 'GCash', icon: Smartphone, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { id: 'maya', name: 'Maya', icon: Wallet, color: 'text-green-500', bgColor: 'bg-green-100' },
    { id: 'coinsph', name: 'Coins.ph', icon: Smartphone, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { id: 'pdax', name: 'PDAX', icon: Wallet, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { id: 'qrph', name: 'QR Ph', icon: QrCode, color: 'text-blue-600', bgColor: 'bg-blue-50' }
  ],
  // Example for another region
  SG: [
    { id: 'paynow', name: 'PayNow', icon: QrCode, color: 'text-red-500', bgColor: 'bg-red-100' },
    { id: 'grabpay', name: 'GrabPay', icon: Smartphone, color: 'text-green-500', bgColor: 'bg-green-100' }
  ]
};