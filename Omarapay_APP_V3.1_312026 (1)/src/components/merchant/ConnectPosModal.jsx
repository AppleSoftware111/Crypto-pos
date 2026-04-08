import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Loader2 } from 'lucide-react';
import { companyLogin } from '@/lib/posApi';
import {
  hydratePosTokensFromStorage,
  persistPosCompanySnapshot,
  persistPosCompanyToken,
} from '@/lib/posSessionStorage';
import { linkUserPosAccount } from '@/lib/userPosApi';
import { getAccessToken } from '@/lib/authApi';
import { POS_DEFAULT_COMPANY_ID } from '@/config/posConfig';
import { useToast } from '@/components/ui/use-toast';

const ConnectPosModal = ({ open, onOpenChange, onConnected }) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = String(password || '').trim();
    if (!p || submitting) return;
    setSubmitting(true);
    try {
      const data = await companyLogin(p);
      if (data?.token) {
        persistPosCompanyToken(data.token);
        persistPosCompanySnapshot(data.company);
        hydratePosTokensFromStorage();
      }
      let accountLinked = false;
      if (getAccessToken()) {
        try {
          await linkUserPosAccount(p);
          accountLinked = true;
        } catch (linkErr) {
          console.warn('user POS link:', linkErr?.response?.data || linkErr?.message);
        }
      }
      toast({
        title: 'POS connected',
        description: accountLinked
          ? 'Company session saved and your Omarapay account is linked for live transactions.'
          : 'Company session saved. Live mode can load POS transactions.',
        className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      });
      setPassword('');
      onOpenChange(false);
      onConnected?.();
    } catch (err) {
      toast({
        title: 'Could not connect',
        description: err?.response?.data?.error || 'Check the company password and API URL.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Link2 className="h-5 w-5" />
            <DialogTitle>Connect POS</DialogTitle>
          </div>
          <DialogDescription>
            Enter your Crypto POS <strong>company password</strong> (same as company login on the POS app).
            This stores a company session in the browser so Live mode can read transactions. If you are signed
            in to Omarapay, we also link your account to this company for JWT-based access.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            Default UAT company id: <span className="font-mono">{POS_DEFAULT_COMPANY_ID}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="connect-pos-pw">Company password</Label>
            <Input
              id="connect-pos-pw"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder="Company password"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !password.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPosModal;
