import React, { useEffect, useState } from "react";
import { useUsers } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Euro, Wallet, Loader2 } from "lucide-react";

const DigitalBalanceWallet = () => {
  const { digitalBalances, loading } = useUsers();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Just a small visual delay to prevent flicker if context loads instantly
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, [loading]);

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const BalanceItem = ({ currency, amount, icon: Icon, color }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium">{currency} Wallet</p>
          <p className="text-xs text-muted-foreground">Digital Fiat</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">
          {currency === "USD" && "$"}
          {currency === "PHP" && "₱"}
          {currency === "EUR" && "€"}
          {formatAmount(amount)}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" /> Digital Ledger
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading || isInitializing ? (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <>
                <BalanceItem
                currency="USD"
                amount={digitalBalances.USD}
                icon={DollarSign}
                color="bg-green-500"
                />

                <BalanceItem
                currency="PHP"
                amount={digitalBalances.PHP}
                icon={DollarSign}
                color="bg-blue-500"
                />

                <BalanceItem
                currency="EUR"
                amount={digitalBalances.EUR}
                icon={Euro}
                color="bg-indigo-500"
                />

                <div className="pt-4 border-t">
                    <p className="text-xs text-center text-muted-foreground">
                        Funds in digital wallets are backed 1:1 and can be withdrawn to bank accounts.
                    </p>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default DigitalBalanceWallet;