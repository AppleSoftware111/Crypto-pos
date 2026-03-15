import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getContextFromPath } from '@/services/OmaraAIContextService';
import { useLocation } from 'react-router-dom';

const OmaraAISuggestedQuestions = ({ onSelect }) => {
    const location = useLocation();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const context = getContextFromPath(location.pathname);
        
        const suggestions = {
            'dashboard': [
                "What does my dashboard show?",
                "How do I switch to Live mode?",
                "Where are my recent transactions?",
                "How do I request a payout?"
            ],
            'transactions': [
                "How do I filter transactions?",
                "Can I export this data?",
                "What do the statuses mean?",
                "How do I refund a payment?"
            ],
            'payouts': [
                "How do I add a bank account?",
                "What are the withdrawal limits?",
                "How long do payouts take?",
                "Can I withdraw in crypto?"
            ],
            'products': [
                "How do I add a new product?",
                "Can I manage inventory here?",
                "How do I delete a product?",
                "Can I set different currencies?"
            ],
            'settings': [
                "How do I change my password?",
                "Where are my API keys?",
                "How do I enable 2FA?",
                "Can I change my business name?"
            ],
            'general': [
                "How do I get started?",
                "What is Demo Mode?",
                "How do I accept payments?",
                "Tell me about Omara features"
            ]
        };

        setQuestions(suggestions[context] || suggestions['general']);
    }, [location.pathname]);

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {questions.map((q, idx) => (
                <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-auto py-1.5 px-3 bg-white/50 hover:bg-white hover:text-primary whitespace-normal text-left"
                    onClick={() => onSelect(q)}
                >
                    {q}
                </Button>
            ))}
        </div>
    );
};

export default OmaraAISuggestedQuestions;