import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import POSFlow from '@/components/pos/POSFlow';

/**
 * POS (Point of Sale) - Accept Payments
 * Embedded in Omarapay user dashboard. Uses Crypto POS backend API.
 */
const POSFlowPage = () => {
  return (
    <StandardPageWrapper
      title="Accept Payments"
      subtitle="Point of Sale — accept crypto and card payments"
      className="!pt-4"
    >
      <div className="max-w-4xl mx-auto">
        <POSFlow />
      </div>
    </StandardPageWrapper>
  );
};

export default POSFlowPage;
