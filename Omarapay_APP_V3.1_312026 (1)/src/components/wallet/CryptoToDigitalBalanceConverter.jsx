import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUsers } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { getCryptoPrices, getFiatRates } from "@/lib/priceCache";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2, RefreshCw } from "lucide-react";

// Mapping Token ID for CoinGecko
const COIN_IDS = {
    ETH: 'ethereum',
    USDT: 'tether',
    USDC: 'usd-coin',
    MATIC: 'matic-network',
    BNB: 'binancecoin'
};

const CryptoToDigitalBalanceConverter = () => {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("ETH");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [isConverting, setIsConverting] = useState(false);
  const [prices, setPrices] = useState({});
  const [fiatRates, setFiatRates] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const { updateDigitalBalance } = useUsers();
  const { walletAddress } = useAuth();
  const { toast } = useToast();

  const fetchRates = async () => {
    setIsLoadingRates(true);
    try {
        const p = await getCryptoPrices(Object.values(COIN_IDS));
        const f = await getFiatRates();
        setPrices(p);
        setFiatRates(f);
    } catch (e) {
        toast({ title: "Error", description: "Could not fetch latest rates.", variant: "destructive" });
    } finally {
        setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const numericAmount = useMemo(() => Number(amount || 0), [amount]);

  // Calculate Conversion: Amount * TokenPrice(USD) * FiatRate(Target/USD)
  const conversionRate = useMemo(() => {
    const coinId = COIN_IDS[token];
    const tokenPriceUsd = prices[coinId]?.usd || 0;
    const fiatRate = fiatRates[targetCurrency] || 1; // Base is USD
    return tokenPriceUsd * fiatRate;
  }, [token, targetCurrency, prices, fiatRates]);

  const estimatedOutput = useMemo(() => {
    return numericAmount * conversionRate;
  }, [numericAmount, conversionRate]);

  const handleConvert = () => {
    if (!walletAddress) {
      toast({ title: "Wallet Not Connected", variant: "destructive" });
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      toast({ title: "Invalid Amount", variant: "destructive" });
      return;
    }

    setIsConverting(true);

    // Simulate blockchain confirmation time
    setTimeout(() => {
      // 1. Update Digital Balance
      updateDigitalBalance(targetCurrency, estimatedOutput);
      
      // 2. Log Transaction to LocalStorage
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Conversion',
        from: token,
        to: targetCurrency,
        amountIn: numericAmount,
        amountOut: estimatedOutput,
        rate: conversionRate,
        timestamp: new Date().toISOString(),
        status: 'Completed'
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('omara_conversion_history') || '[]');
      localStorage.setItem('omara_conversion_history', JSON.stringify([newTx, ...existingHistory]));

      toast({
        title: "Conversion Successful",
        description: `Converted ${numericAmount} ${token} → ${estimatedOutput.toFixed(2)} ${targetCurrency}`,
      });

      setIsConverting(false);
      setAmount("");
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Convert Crypto</CardTitle>
                <CardDescription>Real-time market rates via CoinGecko</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchRates} disabled={isLoadingRates}>
                <RefreshCw className={`h-4 w-4 ${isLoadingRates ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>From Wallet</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COIN_IDS).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Price: ${prices[COIN_IDS[token]]?.usd?.toFixed(2) || "---"}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>To Digital Balance</Label>
          <div className="flex gap-2">
            <Input
              value={estimatedOutput.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              disabled
              className="flex-1 bg-gray-50 dark:bg-gray-900"
            />
            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="PHP">PHP</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <p className="text-xs text-muted-foreground">
            Rate: 1 {token} ≈ {conversionRate.toFixed(2)} {targetCurrency}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleConvert}
          disabled={isConverting || !numericAmount || !conversionRate}
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming on-chain...
            </>
          ) : (
            "Convert Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CryptoToDigitalBalanceConverter;