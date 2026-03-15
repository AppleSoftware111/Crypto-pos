import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Settings, Wallet, Fingerprint, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBusiness } from '@/context/BusinessContext';
import { useToast } from '@/components/ui/use-toast';

const SuccessStep = ({ data, clearDraft, walletAddress, signature }) => {
  const navigate = useNavigate();
  const { userUUID, businessProfile } = useBusiness();
  const { toast } = useToast();

  useEffect(() => {
    if (clearDraft) clearDraft();
  }, [clearDraft]);

  const copyToClipboard = (text, label) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  return (
    <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
      <div className="flex justify-center">
        <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
        >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🎉 Merchant Account Created!</h2>
        <p className="text-muted-foreground mt-2">Your account is securely bound to your wallet.</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-4 shadow-inner">
         
         <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
             <div>
                 <p className="text-xs text-muted-foreground uppercase">Business Name</p>
                 <p className="font-semibold">{data.businessName}</p>
             </div>
             <div>
                 <p className="text-xs text-muted-foreground uppercase">Status</p>
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active Merchant
                 </span>
             </div>
         </div>

         <div className="space-y-3">
             <div className="flex items-center justify-between group">
                 <div className="flex items-center gap-2">
                     <Fingerprint className="w-4 h-4 text-purple-500" />
                     <span className="text-sm font-medium">User UUID</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <code className="text-xs bg-white dark:bg-black px-2 py-1 rounded border">{userUUID?.substring(0,8)}...</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(userUUID, "UUID")}>
                        <Copy className="w-3 h-3" />
                    </Button>
                 </div>
             </div>

             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <Wallet className="w-4 h-4 text-blue-500" />
                     <span className="text-sm font-medium">Wallet Bound</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <code className="text-xs bg-white dark:bg-black px-2 py-1 rounded border" title={walletAddress}>
                        {walletAddress?.substring(0,6)}...{walletAddress?.substring(walletAddress.length-4)}
                    </code>
                 </div>
             </div>

             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <Settings className="w-4 h-4 text-orange-500" />
                     <span className="text-sm font-medium">Merchant ID</span>
                 </div>
                 <code className="text-xs bg-white dark:bg-black px-2 py-1 rounded border">
                     {businessProfile?.merchantId || 'Generating...'}
                 </code>
             </div>
         </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300 text-left border border-blue-100">
          <p className="font-semibold mb-1">🔒 Security Note</p>
          <p>You can only access this merchant account when connected with this specific wallet. If you switch wallets, this account will be hidden.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button onClick={() => navigate('/merchant/dashboard')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20" size="lg">
            Go to Merchant Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;