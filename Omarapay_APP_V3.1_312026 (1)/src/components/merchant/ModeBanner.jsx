import React from 'react';
import { useMerchant } from '@/context/MerchantContext';
import { Button } from '@/components/ui/button';
import { FlaskConical, AlertTriangle, X, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ModeBanner = ({ className, onStartWalkthrough }) => {
    const { isModeLive, switchToLiveMode } = useMerchant();
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    if (isModeLive()) {
        return (
            <div className={cn("bg-red-50 border-b border-red-100 px-4 py-3 flex items-center justify-between", className)}>
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-900">Live Mode Active</p>
                        <p className="text-xs text-red-700 hidden sm:block">All transactions are real and will involve actual fund transfers.</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-900 hover:text-red-900 hover:bg-red-100 h-8 w-8"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between", className)}>
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <FlaskConical className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-900">You are in Demo Mode</p>
                    <p className="text-xs text-blue-700 hidden sm:block">This is a sandbox environment. Data shown here is for testing purposes only.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {onStartWalkthrough && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100 text-xs h-8 gap-1 hidden md:flex"
                        onClick={onStartWalkthrough}
                    >
                        <PlayCircle size={14} /> Start Walkthrough
                    </Button>
                )}
                <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-none text-xs h-8"
                    onClick={switchToLiveMode}
                >
                    Switch to Live
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-900 hover:text-blue-900 hover:bg-blue-100 h-8 w-8"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ModeBanner;