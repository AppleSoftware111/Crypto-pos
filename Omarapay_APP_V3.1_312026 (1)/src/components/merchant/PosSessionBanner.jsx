import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlugZap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Shown in Live mode when the dashboard could not load POS data (no JWT link and no POS tokens).
 */
const PosSessionBanner = ({ className, onConnect, onDismiss }) => {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  return (
    <div
      className={cn(
        'bg-amber-50 border-b border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="bg-amber-100 p-2 rounded-full shrink-0">
          <PlugZap className="h-4 w-4 text-amber-800" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-950">Connect the merchant dashboard to POS</p>
          <p className="text-xs text-amber-900/90 mt-0.5">
            Live analytics use the Crypto POS API. Sign in on the{' '}
            <Link to="/merchant/cashier" className="underline font-medium">
              cashier terminal
            </Link>{' '}
            or use <strong>Connect POS</strong> with your company password. Omarapay login alone does not grant
            POS access until you connect or link your account.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="default" className="bg-amber-800 hover:bg-amber-900" onClick={onConnect}>
          Connect POS
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-900" onClick={() => { setVisible(false); onDismiss?.(); }} aria-label="Dismiss">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PosSessionBanner;
