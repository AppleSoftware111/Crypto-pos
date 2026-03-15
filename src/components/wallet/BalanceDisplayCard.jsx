import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const BalanceDisplayCard = ({ currency, amount, lastUpdated, onRefresh, colorFrom, colorTo }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        {/* Glassmorphism applied via backdrop-blur and semi-transparent backgrounds in CSS variables or classes */}
        <Card className={`overflow-hidden border-0 shadow-xl rounded-2xl relative bg-gradient-to-br ${colorFrom} ${colorTo}`}>
            {/* Glass Overlay Effect */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-0"></div>
            
            <CardContent className="p-6 relative z-10 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-white/90 text-sm font-medium mb-1 tracking-wide uppercase">{currency} Balance</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₱'}
                            {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-inner border border-white/20">
                        <span className="font-bold text-lg">{currency}</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-end">
                    <p className="text-xs text-white/70">
                        Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Just now'}
                    </p>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 rounded-full text-white hover:bg-white/20 hover:text-white transition-colors"
                        onClick={onRefresh}
                    >
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
            </CardContent>
        </Card>
    </motion.div>
  );
};

export default BalanceDisplayCard;