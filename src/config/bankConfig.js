import { Building2, Landmark, Building } from 'lucide-react';

export const bankConfig = {
  PH: [
    { code: 'BDO', name: 'Banco de Oro (BDO)', icon: Building2, format: '####-####-####' },
    { code: 'BPI', name: 'Bank of the Philippine Islands (BPI)', icon: Landmark, format: '####-####-##' },
    { code: 'MBTC', name: 'Metrobank', icon: Building, format: '####-####-#####' },
    { code: 'PNB', name: 'Philippine National Bank (PNB)', icon: Building2, format: '####-####-####' },
    { code: 'SECB', name: 'Security Bank', icon: Landmark, format: '####-####-####-##' },
    { code: 'UBP', name: 'UnionBank', icon: Building, format: '####-####-####' },
    { code: 'MAY', name: 'Maybank', icon: Building2, format: '####-####-####' },
    { code: 'RCBC', name: 'Rizal Commercial Banking Corp (RCBC)', icon: Landmark, format: '####-####-####' },
    { code: 'LBP', name: 'Landbank', icon: Building, format: '####-####-##' },
    { code: 'DBP', name: 'Development Bank of the Philippines', icon: Building2, format: '####-####-####' }
  ],
  // Add other countries as needed
  US: [
      { code: 'CHASE', name: 'Chase Bank', icon: Building2, format: '#########' },
      { code: 'BOA', name: 'Bank of America', icon: Landmark, format: '#########' },
  ]
};