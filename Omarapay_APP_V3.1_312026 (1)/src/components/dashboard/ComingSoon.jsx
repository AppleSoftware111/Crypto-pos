import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from 'lucide-react';

const ComingSoon = ({ title, description }) => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <Construction className="w-16 h-16 mb-4 text-primary" />
                <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
                <p>This page is currently under construction. We're working hard to bring you this feature.</p>
            </CardContent>
        </Card>
    );
};

export default ComingSoon;