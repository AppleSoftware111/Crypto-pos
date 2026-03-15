import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  { name: "TechCorp" },
  { name: "Global Retail" },
  { name: "Finance Plus" },
  { name: "Secure Pay" },
  { name: "Metro Bank" },
  { name: "Shop Network" }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PartnersSection = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Trusted by Leading Businesses</h2>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="flex items-center justify-center"
            >
              <div className="h-16 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-4 w-full">
                <span className="text-lg font-bold text-gradient">{partner.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;