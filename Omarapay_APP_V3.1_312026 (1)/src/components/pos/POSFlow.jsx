import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import * as posApi from '@/lib/posApi';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { CARD_METHODS, isCardMethod } from '@/config/posPaymentMethods';
import { CreditCard, Loader2, LogOut, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const POLL_INTERVAL_MS = 2000;

function luhnCheck(cardNumber) {
  const digits = String(cardNumber).replace(/\D/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function parseExpiry(expiryStr) {
  const parts = String(expiryStr).trim().split(/\/|\s/).filter(Boolean);
  if (parts.length < 2) return null;
  const month = parseInt(parts[0], 10);
  const yearPart = parts[1].length === 2 ? 2000 + parseInt(parts[1], 10) : parseInt(parts[1], 10);
  if (month < 1 || month > 12 || !yearPart) return null;
  return { month, year: yearPart };
}

export default function POSFlow() {
  const { toast } = useToast();
  const [step, setStep] = useState('auth');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [companyPassword, setCompanyPassword] = useState('');
  const [company, setCompany] = useState(null);
  const [cashiers, setCashiers] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState(null);
  const [cashierPassword, setCashierPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [coins, setCoins] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [payment, setPayment] = useState(null);
  const [cryptoRate, setCryptoRate] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const checkAuth = useCallback(async () => {
    try {
      const status = await posApi.posAuthStatus();
      if (status.valid && status.companyAuthenticated && status.cashierAuthenticated) {
        setStep('methods');
        return true;
      }
    } catch (_) {}
    return false;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await checkAuth();
      if (mounted) setLoading(false);
      if (!ok && mounted) setStep('auth');
    })();
    return () => { mounted = false; };
  }, [checkAuth]);

  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setAuthLoading(true);
    try {
      const data = await posApi.companyLogin(companyPassword);
      if (data.token) {
        if (typeof window !== 'undefined') window.__POS_COMPANY_TOKEN__ = data.token;
        setCompany(data.company);
        const list = await posApi.getCashiers(data.company.id);
        setCashiers(list);
        setCompanyPassword('');
        if (list.length === 1) setSelectedCashier(list[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Company login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCashierLogin = async (e) => {
    e.preventDefault();
    if (!company || !selectedCashier) return;
    setError(null);
    setAuthLoading(true);
    try {
      const data = await posApi.cashierLogin(company.id, selectedCashier.id, cashierPassword);
      if (data.token) {
        if (typeof window !== 'undefined') window.__POS_CASHIER_TOKEN__ = data.token;
        setCashierPassword('');
        setStep('methods');
        loadCoins();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Cashier login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const loadCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await posApi.getCoins();
      setCoins(list);
    } catch (err) {
      setError(err.message || 'Failed to load payment methods');
      toast({ title: 'Connection Error', description: 'Ensure POS backend is running at ' + getPOSApiBaseUrl(), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await posApi.posLogout();
    } catch (_) {}
    if (typeof window !== 'undefined') {
      window.__POS_COMPANY_TOKEN__ = null;
      window.__POS_CASHIER_TOKEN__ = null;
    }
    setCompany(null);
    setCashiers([]);
    setSelectedCashier(null);
    setStep('auth');
    setPayment(null);
    setSelectedMethod(null);
    setAmount('');
    setSimulating(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardholderName('');
  };

  const handleCardFormSubmit = async (e) => {
    e.preventDefault();
    const rawCard = cardNumber.replace(/\s/g, '');
    const parsed = parseExpiry(expiry);
    if (!luhnCheck(rawCard)) {
      toast({ title: 'Invalid card number', variant: 'destructive' });
      return;
    }
    if (!parsed) {
      toast({ title: 'Invalid expiry (use MM/YY)', variant: 'destructive' });
      return;
    }
    const now = new Date();
    const expiryDate = new Date(parsed.year, parsed.month, 0, 23, 59, 59);
    if (expiryDate < now) {
      toast({ title: 'Card expired', variant: 'destructive' });
      return;
    }
    if (!/^\d{3,4}$/.test(cvv.replace(/\s/g, ''))) {
      toast({ title: 'Invalid CVV (3 or 4 digits)', variant: 'destructive' });
      return;
    }
    const name = cardholderName.trim();
    if (name.length < 2) {
      toast({ title: 'Enter cardholder name', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await posApi.createCardPayment(selectedMethod.methodCode, amount, {
        cardNumber: rawCard,
        expiryMonth: String(parsed.month).padStart(2, '0'),
        expiryYear: String(parsed.year),
        cvv: cvv.replace(/\s/g, ''),
        cardholderName: name,
      });
      setPayment(data);
      setStep('success');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardholderName('');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Card payment failed';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'methods' && coins.length === 0 && !loading) loadCoins();
  }, [step]);

  const onSelectMethod = (method) => {
    setSelectedMethod(method);
    setAmount('');
    setCryptoRate(null);
    setStep('amount');
    if (!isCardMethod(method)) {
      const code = method.method_code || method.methodCode;
      if (code) posApi.getCryptoRate(code, 100).then((r) => setCryptoRate(r)).catch(() => {});
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    const methodCode = selectedMethod?.method_code || selectedMethod?.methodCode;
    if (!methodCode || !amount || parseFloat(amount) <= 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await posApi.createPayment(methodCode, amount);
      setPayment(data);
      setStep('display');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create payment');
      toast({ title: 'Error', description: err.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 'display' || !payment?.paymentId) return;
    const id = setInterval(async () => {
      try {
        const status = await posApi.checkPaymentStatus(payment.paymentId);
        if (status.confirmed) setStep('success');
      } catch (_) {}
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [step, payment?.paymentId]);

  const copyAddress = () => {
    if (payment?.address) {
      navigator.clipboard.writeText(payment.address);
      toast({ title: 'Copied', description: 'Address copied to clipboard' });
    }
  };

  const baseUrl = getPOSApiBaseUrl();

  const [iconErrors, setIconErrors] = useState({});
  const getCoinIconUrl = (coin) => {
    const icon = coin.icon;
    if (!icon) return null;
    if (icon.startsWith('http://') || icon.startsWith('https://')) return icon;
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const path = icon.startsWith('/') ? icon.slice(1) : icon;
    return `${base}/${path}`;
  };

  if (loading && step === 'methods' && coins.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading payment methods...</p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'auth') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> POS Login
            </CardTitle>
            <CardDescription>Sign in with your company and cashier credentials.</CardDescription>
          </div>
          <p className="text-xs text-muted-foreground">Backend: {baseUrl}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!company ? (
            <form onSubmit={handleCompanyLogin} className="space-y-4">
              <div>
                <Label htmlFor="company-password">Company password</Label>
                <Input
                  id="company-password"
                  type="password"
                  value={companyPassword}
                  onChange={(e) => setCompanyPassword(e.target.value)}
                  placeholder="Enter company password"
                  className="mt-2"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Continue
              </Button>
            </form>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Logged in as <strong>{company.name}</strong>. Select cashier:</p>
              <div className="space-y-2">
                {cashiers.map((c) => (
                  <Button
                    key={c.id}
                    type="button"
                    variant={selectedCashier?.id === c.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCashier(c)}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
              <form onSubmit={handleCashierLogin} className="space-y-4">
                <div>
                  <Label htmlFor="cashier-password">Cashier password</Label>
                  <Input
                    id="cashier-password"
                    type="password"
                    value={cashierPassword}
                    onChange={(e) => setCashierPassword(e.target.value)}
                    placeholder="Enter cashier password"
                    className="mt-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setCompany(null); setCashiers([]); setSelectedCashier(null); }}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={authLoading || !selectedCashier}>
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign in as cashier
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'methods') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Select payment method</CardTitle>
            <CardDescription>Choose how the customer will pay.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ...coins.filter((c) => c.enabled !== false).map((c) => ({ ...c, type: 'crypto', methodCode: c.method_code || c.methodCode })),
              ...CARD_METHODS.filter((c) => c.enabled !== false),
            ].map((method) => {
              const isCard = isCardMethod(method);
              const iconUrl = isCard ? method.iconUrl : getCoinIconUrl(method);
              const showIcon = iconUrl && !iconErrors[method.id];
              const fallbackLetter = (method.symbol || method.name || '?').charAt(0).toUpperCase();
              return (
                <Button
                  key={method.id}
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2 items-center"
                  onClick={() => onSelectMethod(method)}
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {showIcon ? (
                      <img
                        src={iconUrl}
                        alt=""
                        className="w-8 h-8 object-contain"
                        onError={() => setIconErrors((prev) => ({ ...prev, [method.id]: true }))}
                      />
                    ) : isCard ? (
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <span className="text-lg font-semibold text-muted-foreground">{fallbackLetter}</span>
                    )}
                  </div>
                  <span className="font-semibold">{method.name}</span>
                  <span className="text-xs text-muted-foreground">{method.symbol}</span>
                </Button>
              );
            })}
          </div>
          {coins.length === 0 && CARD_METHODS.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">No payment methods configured. Check POS backend admin.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'amount') {
    const usdAmount = parseFloat(amount) || 0;
    const cryptoAmount = cryptoRate ? usdAmount / (cryptoRate.usdRate || 1) : null;
    const isCard = isCardMethod(selectedMethod);
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Enter amount</CardTitle>
            <CardDescription>{selectedMethod?.name} — enter amount in USD.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setStep('methods'); setSelectedMethod(null); setAmount(''); setCryptoRate(null); }}>
            Back
          </Button>
        </CardHeader>
        <CardContent>
          {isCard ? (
            <form onSubmit={(e) => { e.preventDefault(); if (usdAmount > 0) { setError(null); setStep('card-form'); } }} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-2 text-lg"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={!amount || usdAmount <= 0}>
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-2 text-lg"
                  required
                />
              </div>
              {cryptoAmount != null && amount && (
                <p className="text-sm text-muted-foreground">
                  ≈ {cryptoAmount.toFixed(8)} {selectedMethod?.symbol}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading || !amount || usdAmount <= 0}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create payment request
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'card-form' && selectedMethod) {
    const formatCardNumber = (v) =>
      v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    const formatExpiryInput = (v) => {
      const d = v.replace(/\D/g, '').slice(0, 4);
      if (d.length <= 2) return d;
      return `${d.slice(0, 2)}/${d.slice(2)}`;
    };
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Card payment</CardTitle>
            <CardDescription>{selectedMethod.name} — ${parseFloat(amount || 0).toFixed(2)} USD</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setStep('amount'); setError(null); }}>
            Back
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleCardFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder name</Label>
              <Input
                id="cardholderName"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on card"
                className="mt-2"
                autoComplete="cc-name"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card number</Label>
              <Input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="mt-2 font-mono"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                  placeholder="MM/YY"
                  className="mt-2"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="mt-2"
                  maxLength={4}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Pay ${parseFloat(amount || 0).toFixed(2)}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === 'display' && payment) {
    const handleSimulate = async () => {
      if (!payment?.paymentId || simulating) return;
      setSimulating(true);
      try {
        await posApi.simulatePaymentConfirm(payment.paymentId);
        setStep('success');
      } catch (err) {
        toast({ title: 'Simulate failed', description: err.response?.data?.error || err.message, variant: 'destructive' });
      } finally {
        setSimulating(false);
      }
    };
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay {payment.amount} {payment.symbol || selectedMethod?.symbol}</CardTitle>
          <CardDescription>Customer should send the exact amount to the address below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payment.address && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="text-xs break-all flex-1">{payment.address}</code>
              <Button variant="ghost" size="icon" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          {payment.qrData && (
            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <img
                src={`${baseUrl}/api/qrcode/${encodeURIComponent(payment.qrData)}`}
                alt="Payment QR"
                className="w-48 h-48 object-contain"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Waiting for payment... (checking every 2s)
          </p>
          <Button variant="outline" className="w-full" onClick={handleSimulate} disabled={simulating}>
            {simulating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simulate paid (demo)
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    const isCard = payment?.approved || (payment?.method && ['visa', 'mastercard', 'unionpay'].includes(String(payment.method).toLowerCase()));
    return (
      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
          <CardTitle className="mb-2">{isCard ? 'Card payment approved' : 'Payment received'}</CardTitle>
          <CardDescription className="mb-6">
            {isCard && payment?.card?.last4
              ? `Card ending ${payment.card.last4} — payment confirmed.`
              : 'The payment has been confirmed.'}
          </CardDescription>
          <Button
            onClick={() => {
              setStep('methods');
              setPayment(null);
              setSelectedMethod(null);
              setAmount('');
              setCardNumber('');
              setExpiry('');
              setCvv('');
              setCardholderName('');
            }}
          >
            New payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
