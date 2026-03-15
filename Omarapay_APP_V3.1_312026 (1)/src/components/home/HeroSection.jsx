import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HeroSection = () => {
  return <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden hero-pattern">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center lg:text-left">
            {/* Logo in Hero */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2
          }} className="mb-6 flex justify-center lg:justify-start">
               <img src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/omarapay_logo-k40tT.png" alt="Omara Payments Logo" className="h-20 w-auto drop-shadow-lg" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block">Payments Technology</span>
              <span className="text-gradient">Built For Your Business</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              With Omara point of sale systems, payment processing, and merchant services, 
              we have everything you need to take your business straight to the top.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/business-locator">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 w-full sm:w-auto">
                  Schedule a Pickup
                  <PackageSearch size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                  Register Your Business
                  <UserPlus size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img alt="Modern payment terminal with digital display" className="w-full h-auto rounded-2xl" src="https://images.unsplash.com/photo-1649424219328-a61c36cc7892" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <img src="https://horizons-cdn.hostinger.com/4e11d677-f450-4074-b1a2-d97d8613297e/310160a090067ce6332ec6e51cd46366.png" alt="Icon" className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Seamless Transactions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Fast, secure, and reliable payment processing</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HeroSection;