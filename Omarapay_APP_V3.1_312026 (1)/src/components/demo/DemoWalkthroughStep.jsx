import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, X } from 'lucide-react';

const DemoWalkthroughStep = ({ step, currentStepIndex, totalSteps, onNext, onSkip, onPrev }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-blue-100 dark:border-blue-900 w-[350px] md:w-[400px] z-[60] overflow-hidden"
                style={{
                    position: 'absolute',
                    // Positioning logic handled by parent via Popper/Floating UI or manual calculation, 
                    // for now we render relative to parent container in the center if no styles passed
                }}
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{step.title}</h3>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/90 font-medium">
                            Step {currentStepIndex + 1} of {totalSteps}
                        </span>
                    </div>
                    <button 
                        onClick={onSkip}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {step.description}
                    </p>

                    {step.highlights && step.highlights.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                            {step.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                                    <div className="bg-blue-200 dark:bg-blue-700 rounded-full p-0.5">
                                        <Check size={10} />
                                    </div>
                                    {highlight}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onSkip}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            Skip Tour
                        </Button>
                        <div className="flex gap-2">
                            {currentStepIndex > 0 && (
                                <Button variant="outline" size="sm" onClick={onPrev}>
                                    Back
                                </Button>
                            )}
                            <Button size="sm" onClick={onNext} className="gap-1">
                                {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                                <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DemoWalkthroughStep;