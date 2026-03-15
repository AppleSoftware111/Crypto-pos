import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useMerchant } from "@/context/MerchantContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Wallet, Coins } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useBalance } from "wagmi";

const UserWalletDashboardPage = () => {
  const { currentUser } = useAuth();
  const { getTransactionsByUserId } = useMerchant();
  const { toast } = useToast();

  // --- SAFETY: prevent crashes if name is missing ---
  const firstName = (currentUser?.name || "User").split(" ")[0];

  // --- Transactions (still from your MerchantContext, no mock balance math) ---
  const transactions = currentUser ? getTransactionsByUserId(currentUser.id) : [];

  // --- Real on-chain balance from connected wallet ---
  const walletAddress = currentUser?.wallet_address;

  const {
    data: nativeBalance,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useBalance({
    address: walletAddress,
    watch: true,
    // enabled prevents wagmi from running before we have an address
    enabled: Boolean(walletAddress),
  });

  const formattedBalance = nativeBalance
    ? Number(nativeBalance.formatted).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })
    : "0.0000";

  const balanceSymbol = nativeBalance?.symbol || "";

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 Feature in Progress",
      description: `${feature} will be available soon!`,
    });
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Welcome, {firstName}!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your personal wallet overview.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet /> Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!walletAddress ? (
                <>
                  <p className="text-lg opacity-80">No wallet connected.</p>
                  <p className="text-sm opacity-80">
                    Please connect your wallet to view balance.
                  </p>
                </>
              ) : balanceLoading ? (
                <p className="text-lg opacity-80">Loading balance...</p>
              ) : balanceError ? (
                <>
                  <p className="text-lg opacity-80">Unable to fetch balance.</p>
                  <p className="text-sm opacity-80">Please try again.</p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-bold">
                    {formattedBalance} {balanceSymbol}
                  </p>
                  <p className="text-sm opacity-80">On-chain funds</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins /> FX Token Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {/* NOTE: Replace this with a real token balance later if desired */}
                0 <span className="text-lg text-muted-foreground">FXT</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Rewards will appear here when enabled.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => handleNotImplemented("Send Money")}>
              <ArrowUpRight className="mr-2 h-4 w-4" /> Send Money
            </Button>
            <Button
              onClick={() => handleNotImplemented("Request Money")}
              variant="secondary"
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" /> Request Money
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest wallet activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.slice(0, 5).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "Completed" ? "secondary" : "outline"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        Number(tx.amount) > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Number(tx.amount) > 0 ? "+" : ""}$
                      {Math.abs(Number(tx.amount || 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      No transactions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserWalletDashboardPage;