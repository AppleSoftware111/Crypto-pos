import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Zap, BarChart4, Smartphone, Users, Globe, Code, Cpu, Layers } from 'lucide-react';

const features = [
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: 'Point of Sale Systems',
    description: 'Modern, intuitive POS systems designed to streamline your checkout process and enhance customer experience.'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Secure Payments',
    description: 'State-of-the-art encryption and fraud protection to keep your business and customers safe.'
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Fast Processing',
    description: 'Lightning-fast transaction processing with minimal wait times and maximum reliability.'
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: 'Payment Aggregation',
    description: 'Consolidate multiple payment methods into a single, streamlined platform for global reach.'
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: 'Web3 Integrations',
    description: 'Embrace the future of finance with seamless Web3 and cryptocurrency payment solutions.'
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: 'Remittance API',
    description: 'Powerful API for global money transfers, enabling fast and secure cross-border payments.'
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Enterprise Solutions',
    description: 'Tailored payment infrastructures for large-scale businesses with complex needs.'
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: 'Application Builder',
    description: 'Develop custom payment applications and software with our robust builder service.'
  }
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

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Comprehensive Solutions to <span className="text-gradient">Elevate Your Business</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Explore our suite of advanced payment technologies and services, designed to meet the evolving needs of modern businesses.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;