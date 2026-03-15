import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ServiceCard = ({ service, index }) => {
  const { toast } = useToast();
  const { Icon, title, description, features } = service;

  const handleLearnMoreClick = () => {
    toast({
      title: "🚧 Feature in Progress",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 5000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col"
    >
      <div className="p-8 flex-grow">
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
          {Icon && <Icon className="h-12 w-12 text-primary" />}
        </div>
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        
        <h4 className="font-semibold text-lg mb-4">Key Features:</h4>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-8 pb-8 mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleLearnMoreClick}>
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;