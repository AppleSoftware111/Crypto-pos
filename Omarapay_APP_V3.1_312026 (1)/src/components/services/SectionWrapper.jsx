import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SectionWrapper = ({ title, children, className }) => {
  return (
    <section className={cn("py-20", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {title && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {title}
            </motion.h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;