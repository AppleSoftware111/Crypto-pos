import React from 'react';
import { useLocation } from 'react-router-dom';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import POSFlow from '@/components/pos/POSFlow';

/**
 * POS (Point of Sale) - Accept Payments
 * Business account only. Embedded in merchant dashboard. Uses Crypto POS backend API.
 * - /merchant/cashier — staff terminal (kiosk-style chrome)
 * - /merchant/pos?kiosk=1 — same kiosk toolbar on the standard POS page
 */
const POSFlowPage = () => {
  const location = useLocation();
  const kiosk =
    location.pathname === '/merchant/cashier' ||
    new URLSearchParams(location.search).get('kiosk') === '1';

  return (
    <StandardPageWrapper
      title={kiosk ? undefined : 'Accept Payments'}
      subtitle={kiosk ? undefined : 'Point of Sale — accept crypto and card payments'}
      className={kiosk ? '!pt-2' : '!pt-4'}
    >
      <div className="max-w-4xl mx-auto">
        <POSFlow kiosk={kiosk} />
      </div>
    </StandardPageWrapper>
  );
};

export default POSFlowPage;
