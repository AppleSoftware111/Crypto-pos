import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useBusiness } from '@/context/BusinessContext';
import { useToast } from '@/components/ui/use-toast';
import { POS_ENABLED } from '@/config/posConfig';

/**
 * Restricts POS (Accept Payments) to users who have at least one registered business.
 * Regular users are redirected to /wallet with a toast message.
 */
const POSBusinessOnlyGuard = ({ children }) => {
  const { userBusinesses, loading } = useBusiness();
  const { toast } = useToast();
  const hasToasted = useRef(false);

  const hasBusiness = Array.isArray(userBusinesses) && userBusinesses.length > 0;
  const shouldAllow = POS_ENABLED && hasBusiness;

  if (loading) {
    return null;
  }

  if (!shouldAllow) {
    if (POS_ENABLED && !hasToasted.current) {
      hasToasted.current = true;
      toast({
        title: 'Business account required',
        description: 'Accept Payments is available only for business accounts. Register a business to use POS.',
        variant: 'destructive',
      });
    }
    return <Navigate to="/wallet" replace />;
  }

  return children;
};

export default POSBusinessOnlyGuard;
