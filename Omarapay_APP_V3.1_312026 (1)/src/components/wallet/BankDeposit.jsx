import React, { useState, useEffect } from 'react';
import { useUsers } from '@/context/UserContext';
import { bankConfig } from '@/config/bankConfig';
import { paymentStorage } from '@/lib/paymentStorageService';
import { validateBankAccount } from '@/lib/paymentValidation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Building, Plus, Trash2 } from 'lucide-react';

const BankDeposit = () => {
  const { userCountry } = useUsers();
  const { toast } = useToast();
  const [banks, setBanks] = useState([]);
  const [savedAccounts, setSavedAccounts] = useState([]);
  
  const [selectedBank, setSelectedBank] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    setBanks(bankConfig[userCountry] || []);
    setSavedAccounts(paymentStorage.getBankDetails());
  }, [userCountry]);

  const handleSave = () => {
    if (!selectedBank || !accountName || !validateBankAccount(accountNumber)) {
        toast({ variant: "destructive", title: "Invalid Details", description: "Please check your bank details." });
        return;
    }
    const bankDetails = banks.find(b => b.code === selectedBank);
    const newAccount = {
        id: Date.now(),
        bankName: bankDetails.name,
        bankCode: selectedBank,
        accountName,
        accountNumber,
        country: userCountry
    };
    const updated = [...savedAccounts, newAccount];
    paymentStorage.saveBankDetails(updated);
    setSavedAccounts(updated);
    setAccountName('');
    setAccountNumber('');
    toast({ title: "Account Saved", description: "Bank account added successfully." });
  };

  const handleDelete = (id) => {
    const updated = savedAccounts.filter(a => a.id !== id);
    paymentStorage.saveBankDetails(updated);
    setSavedAccounts(updated);
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Add Bank Account</CardTitle>
                <CardDescription>Supported banks in {userCountry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger><SelectValue placeholder="Choose a bank" /></SelectTrigger>
                        <SelectContent>
                            {banks.map(bank => (
                                <SelectItem key={bank.code} value={bank.code}>{bank.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Full Name on Account" />
                </div>
                <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" />
                    {selectedBank && (
                        <p className="text-xs text-muted-foreground">
                            Format: {banks.find(b => b.code === selectedBank)?.format}
                        </p>
                    )}
                </div>
                <Button onClick={handleSave} className="w-full"><Plus className="w-4 h-4 mr-2" /> Save Account</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Saved Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                {savedAccounts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">No saved bank accounts.</p>
                ) : (
                    <div className="space-y-3">
                        {savedAccounts.map(acc => (
                            <div key={acc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full"><Building className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-semibold text-sm">{acc.bankName}</p>
                                        <p className="text-xs text-muted-foreground">{acc.accountName} • {acc.accountNumber}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)} className="text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
};

export default BankDeposit;