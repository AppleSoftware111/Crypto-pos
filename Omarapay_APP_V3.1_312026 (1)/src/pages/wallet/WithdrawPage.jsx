import React, { useState } from 'react';
import { useDigitalBalance } from '@/context/DigitalBalanceContext';
import { useUsers } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building, CreditCard, User, Globe, Loader2, ScanLine, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const WithdrawPage = ({ embedded = false }) => {
  const { withdraw } = useDigitalBalance();
  const { digitalBalances } = useUsers();
  const { walletAddress } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState('bank');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock fee calc
  const fee = 5.00; // Flat fee for demo
  const total = Number(amount) + fee;
  
  // Task 6: Balance Validation
  const currentBalance = digitalBalances[currency] || 0;
  const isInsufficient = Number(amount) > currentBalance;

  const handleWithdraw = async () => {
    setIsProcessing(true);
    try {
        await withdraw(amount, currency, method, { recipient });
        navigate('/wallet');
    } catch (e) {
        // Handled by context
    } finally {
        setIsProcessing(false);
    }
  };

  const methods = [
      { id: 'bank', name: 'Bank Account', icon: Building },
      { id: 'card', name: 'Card Payout', icon: CreditCard },
      { id: 'remit', name: 'Cash Pickup', icon: Globe },
      { id: 'p2p', name: 'Internal Transfer', icon: User },
  ];

  return (
    <div className={`w-full ${!embedded ? 'min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center pt-12' : ''}`}>
      <div className={`w-full ${!embedded ? 'max-w-2xl' : ''} space-y-6`}>
         {!embedded && (
            <Link to="/wallet" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
            </Link>
         )}
        
        {!embedded && <h1 className="text-3xl font-bold tracking-tight">Withdraw & Send</h1>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Method Selection */}
             <Card className="md:col-span-1 h-fit shadow-md border-0">
                <CardHeader>
                    <CardTitle className="text-lg">Method</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 p-4 pt-0">
                    {methods.map(m => (
                        <Button
                            key={m.id}
                            variant={method === m.id ? 'default' : 'ghost'}
                            className={`justify-start ${method === m.id ? 'bg-primary text-primary-foreground shadow-sm' : ''}`}
                            onClick={() => setMethod(m.id)}
                        >
                            <m.icon className="mr-2 h-4 w-4" />
                            {m.name}
                        </Button>
                    ))}
                </CardContent>
             </Card>

             {/* Withdrawal Form */}
             <Card className="md:col-span-2 shadow-lg border-0">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Available Balance: <span className="font-bold text-primary">{currency} {currentBalance.toFixed(2)}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="PHP">PHP</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className={isInsufficient ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {isInsufficient && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Insufficient balance to perform this action
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Recipient / Destination</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder={method === 'p2p' ? "Username, Email or Wallet ID" : "Account Number / IBAN"}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                            {method === 'p2p' && (
                                <Button variant="outline" size="icon">
                                    <ScanLine className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Fee</span>
                        <span className="font-semibold">{currency} {fee.toFixed(2)}</span>
                    </div>

                </CardContent>
                <CardFooter>
                     <Button 
                        className="w-full" 
                        size="lg"
                        disabled={!amount || !recipient || isInsufficient}
                        onClick={() => setShowConfirm(true)}
                        title={isInsufficient ? "Insufficient balance" : ""}
                    >
                        Review Transfer
                    </Button>
                </CardFooter>
             </Card>
        </div>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Withdrawal</DialogTitle>
                    <DialogDescription>Funds will be deducted immediately.</DialogDescription>
                </DialogHeader>
                 <div className="py-4 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Recipient</span>
                        <span className="font-medium">{recipient}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-bold">{currency} {Number(amount).toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Fee</span>
                        <span className="font-bold">{currency} {fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Total Deduction</span>
                        <span className="font-bold text-lg text-red-600">{currency} {total.toFixed(2)}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button onClick={handleWithdraw} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm & Send'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default WithdrawPage;