import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';

const ContactFormSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
      <ContactForm />
    </motion.div>
  );
};

export default ContactFormSection;