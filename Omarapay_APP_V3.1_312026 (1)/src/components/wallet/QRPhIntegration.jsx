import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { paymentStorage } from '@/lib/paymentStorageService';
import { useUsers } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Plus, Trash2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QRPhIntegration = () => {
  const { userCountry } = useUsers();
  const { toast } = useToast();
  const [codes, setCodes] = useState([]);
  const [showGenerate, setShowGenerate] = useState(false);
  
  const [merchantName, setMerchantName] = useState('');
  const [qrId, setQrId] = useState('');

  useEffect(() => {
    setCodes(paymentStorage.getQRPhCodes());
  }, []);

  if (userCountry !== 'PH') return null;

  const handleGenerate = () => {
    if (!merchantName || !qrId) return;
    
    const newCode = {
        id: Date.now(),
        merchantName,
        qrId,
        generatedAt: new Date().toISOString(),
        data: `QRPH:${qrId}:${merchantName}` // Mock standard string
    };
    
    const updated = [...codes, newCode];
    paymentStorage.saveQRPhCodes(updated);
    setCodes(updated);
    setShowGenerate(false);
    setMerchantName('');
    setQrId('');
    toast({ title: "QR Ph Generated", description: "New QR code added successfully." });
  };

  const handleDelete = (id) => {
    const updated = codes.filter(c => c.id !== id);
    paymentStorage.saveQRPhCodes(updated);
    setCodes(updated);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <QrCode className="w-6 h-6 text-blue-600" />
                QR Ph Management
            </h2>
            <Button onClick={() => setShowGenerate(true)}>
                <Plus className="w-4 h-4 mr-2" /> Generate QR
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codes.map(code => (
                <Card key={code.id} className="overflow-hidden">
                    <div className="bg-white p-6 flex justify-center border-b">
                         <QRCodeSVG value={code.data} size={150} />
                    </div>
                    <CardContent className="p-4 space-y-3">
                        <div>
                            <p className="font-bold text-lg">{code.merchantName}</p>
                            <p className="text-sm text-muted-foreground">ID: {code.qrId}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                                <Download className="w-4 h-4 mr-2" /> Save
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(code.id)} className="text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {codes.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No QR Ph codes generated yet.</p>
                </div>
            )}
        </div>

        <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate QR Ph Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Merchant/User Name</Label>
                        <Input value={merchantName} onChange={e => setMerchantName(e.target.value)} placeholder="Display Name" />
                    </div>
                    <div className="space-y-2">
                        <Label>QR ID / Mobile Number</Label>
                        <Input value={qrId} onChange={e => setQrId(e.target.value)} placeholder="09..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default QRPhIntegration;