import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UserContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const RegisterPage = () => {
  const { isConnected, walletAddress } = useAuth();
  const { addUser } = useUsers();
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRegistration = async () => {
        if (isConnected && walletAddress) {
            setIsCreating(true);
            
            // Check if user already exists in simulated DB
            const allUsers = JSON.parse(localStorage.getItem("omara_users") || "[]");
            const existing = allUsers.find(u => u.wallet_address?.toLowerCase() === walletAddress.toLowerCase());

            if (existing) {
                toast({ title: "Welcome Back", description: "Wallet already registered. Redirecting..." });
                setTimeout(() => navigate("/chain-selection"), 1000);
                return;
            }

            // Create new user
            try {
                const newUser = {
                    id: crypto.randomUUID(),
                    wallet_address: walletAddress,
                    role: "User",
                    status: "Active",
                    name: `User ${walletAddress.slice(0,6)}`,
                    created_at: new Date().toISOString(),
                    accountType: "Personal", // Default
                    kycStatus: "Unverified"
                };
                
                await addUser(newUser);
                
                toast({ title: "Identity Created", description: "Redirecting to chain selection..." });
                setTimeout(() => navigate("/chain-selection"), 1500);
            } catch (err) {
                toast({ title: "Error", description: "Failed to create account", variant: "destructive" });
                setIsCreating(false);
            }
        }
    };

    handleRegistration();
  }, [isConnected, walletAddress, addUser, navigate, toast]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 hero-pattern p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-950/80">
          <CardHeader className="text-center flex flex-col items-center">
             <img 
                src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" 
                alt="Omara Logo" 
                className="h-16 w-16 mb-4"
             />
            <CardTitle className="text-3xl font-bold tracking-tight text-gradient">
              Omara Payments
            </CardTitle>
            <CardDescription>
              Connect your wallet to create a decentralized identity.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center space-y-8 py-8">
            {!isCreating ? (
                <>
                    <div className="p-6 border-2 border-dashed border-primary/30 rounded-full bg-primary/5 animate-pulse">
                        <Wallet className="w-16 h-16 text-primary" />
                    </div>
                    <div className="w-full flex justify-center scale-110">
                        <ConnectButton label="Connect Wallet to Start" />
                    </div>
                    <p className="text-xs text-center text-muted-foreground max-w-xs">
                        By connecting, you agree to our Terms of Service. A new account will be created automatically.
                    </p>
                </>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="font-medium text-lg">Creating your identity...</p>
                    <p className="text-sm text-muted-foreground">Verifying wallet address on-chain.</p>
                </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-primary flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;