import React from 'react';
import { Button } from '@/components/ui/button';
import { useMerchant } from '@/context/MerchantContext';
import { FlaskConical, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ModeToggle = () => {
    const { isModeLive, switchToLiveMode, switchToDemoMode } = useMerchant();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                        "gap-2 border-2",
                        isModeLive() 
                            ? "border-red-100 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800" 
                            : "border-blue-100 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
                    )}
                >
                    {isModeLive() ? (
                        <>
                            <CircleDot className="h-4 w-4 fill-red-600 text-red-600" />
                            <span className="font-semibold">Live</span>
                        </>
                    ) : (
                        <>
                            <FlaskConical className="h-4 w-4" />
                            <span className="font-semibold">Demo</span>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Environment</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={switchToDemoMode}
                    className="cursor-pointer gap-2"
                    disabled={!isModeLive()}
                >
                    <FlaskConical className="h-4 w-4 text-blue-600" />
                    <span>Demo Mode</span>
                    {!isModeLive() && <span className="ml-auto text-xs text-muted-foreground">(Active)</span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={switchToLiveMode}
                    className="cursor-pointer gap-2"
                    disabled={isModeLive()}
                >
                    <CircleDot className="h-4 w-4 text-red-600" />
                    <span>Live Mode</span>
                    {isModeLive() && <span className="ml-auto text-xs text-muted-foreground">(Active)</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModeToggle;