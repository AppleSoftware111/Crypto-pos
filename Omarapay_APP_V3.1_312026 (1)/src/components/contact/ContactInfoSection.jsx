import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactInfoItem = ({ icon, title, children }) => (
  <div className="flex items-start">
    {React.cloneElement(icon, { className: "h-6 w-6 mr-4 mt-1 shrink-0" })}
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {children}
    </div>
  </div>
);

const ContactInfoSection = ({ details }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-primary text-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <div className="space-y-6">
          <ContactInfoItem icon={<MapPin />} title="Our Location">
            <p>{details.address}</p>
          </ContactInfoItem>
          
          <ContactInfoItem icon={<Mail />} title="Email Address">
            <p>{details.email}</p>
          </ContactInfoItem>
          
          <ContactInfoItem icon={<Clock />} title="Business Hours">
            <p>{details.businessHours.weekdays}</p>
            <p>{details.businessHours.saturday}</p>
            <p>{details.businessHours.sunday}</p>
          </ContactInfoItem>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Schedule a Demo</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Want to see our payment solutions in action? Schedule a personalized demo with one of our product specialists.
        </p>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Book a Demo
        </Button>
      </div>
    </motion.div>
  );
};

export default ContactInfoSection;