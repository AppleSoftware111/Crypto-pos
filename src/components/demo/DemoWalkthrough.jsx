import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DemoWalkthroughStep from './DemoWalkthroughStep';
import { demoWalkthroughSteps } from '@/data/demoWalkthroughSteps';
import { useMerchant } from '@/context/MerchantContext';

const DemoWalkthrough = ({ isActive, onComplete, onSkip }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const { isModeDemo } = useMerchant();

    useEffect(() => {
        if (!isActive || !isModeDemo()) return;

        const updatePosition = () => {
            const step = demoWalkthroughSteps[currentStepIndex];
            const element = document.querySelector(step.targetSelector);
            
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height,
                    element: element
                });
                
                // Scroll into view with padding
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else if (step.id === 'welcome') {
                // Center screen for welcome
                setTargetRect({
                    top: window.innerHeight / 2 - 150,
                    left: window.innerWidth / 2 - 200,
                    width: 0,
                    height: 0,
                    element: null
                });
            }
        };

        // Small delay to ensure DOM is ready/transitions finished
        const timeout = setTimeout(updatePosition, 300);
        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isActive, currentStepIndex, isModeDemo]);

    const handleNext = () => {
        if (currentStepIndex < demoWalkthroughSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    if (!isActive || !isModeDemo()) return null;

    const currentStep = demoWalkthroughSteps[currentStepIndex];
    
    // Calculate tooltip position relative to target
    const getTooltipStyle = () => {
        if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        
        // Default padding
        const padding = 20;
        
        if (currentStep.id === 'welcome') {
            return { 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            };
        }

        let top = 0;
        let left = 0;

        switch (currentStep.position) {
            case 'right':
                top = targetRect.top;
                left = targetRect.left + targetRect.width + padding;
                break;
            case 'left':
                top = targetRect.top;
                left = targetRect.left - 400 - padding; // 400 is approx width
                break;
            case 'bottom':
                top = targetRect.top + targetRect.height + padding;
                left = targetRect.left;
                break;
            case 'top-left':
                 top = targetRect.top - 250; // shift up
                 left = targetRect.left - 300;
                 break;
            default: // center/bottom fallback
                top = targetRect.top + targetRect.height + padding;
                left = targetRect.left;
        }

        // Boundary checks (basic)
        if (left < 10) left = 10;
        if (left + 400 > window.innerWidth) left = window.innerWidth - 420;

        return {
            top: top,
            left: left,
            position: 'absolute'
        };
    };

    return createPortal(
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Backdrop with hole */}
            <div className="absolute inset-0 bg-black/50 transition-colors duration-500 pointer-events-auto" />
            
            {/* Highlight Glow Effect */}
            {targetRect && targetRect.element && (
                <motion.div
                    layoutId="highlight-box"
                    initial={false}
                    animate={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute border-2 border-blue-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-40 pointer-events-none box-content"
                />
            )}

            {/* Tooltip Content */}
            <div 
                style={getTooltipStyle()} 
                className="z-50 pointer-events-auto transition-all duration-300 ease-out"
            >
                <DemoWalkthroughStep 
                    step={currentStep}
                    currentStepIndex={currentStepIndex}
                    totalSteps={demoWalkthroughSteps.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onSkip={onSkip}
                />
            </div>
        </div>,
        document.body
    );
};

export default DemoWalkthrough;