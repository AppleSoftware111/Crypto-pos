import React from 'react';
import { useContent } from '@/context/ContentContext.js';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const OmaraAISection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-900 text-white">
      {/* Background with specific image */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply z-10" />
         <img 
            src="https://images.unsplash.com/photo-1633354931133-27ac1ee5d853?q=80&w=2574&auto=format&fit=crop" 
            alt="AI Background" 
            className="w-full h-full object-cover opacity-30"
         />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                <Sparkles size={16} />
                <span>New Feature</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Omara AI</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Get instant answers about payments, business solutions, and compliance. Our intelligent assistant is here to guide your business growth 24/7.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Zap size={20} /></div>
                    <span className="text-sm font-medium">Instant Answers</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><MessageSquare size={20} /></div>
                    <span className="text-sm font-medium">Product Education</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><ShieldCheck size={20} /></div>
                    <span className="text-sm font-medium">Business Guidance</span>
                 </div>
              </div>

              <Link to="/ai-assistant">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-indigo-500/25">
                  Chat with Omara AI <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="relative"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />

              <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                  {/* Chat Mockup */}
                  <div className="space-y-4">
                     <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                           What payment methods work best for high-risk industries?
                        </div>
                     </div>
                     <div className="flex justify-start items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                           <Sparkles size={14} />
                        </div>
                        <div className="bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-sm text-sm border border-gray-700/50 shadow-sm w-full">
                           <p className="mb-2">For high-risk industries, we recommend a mix of robust solutions:</p>
                           <ul className="list-disc pl-4 space-y-1 text-gray-300">
                              <li>Crypto Processing (USDT/BTC) for instant settlement.</li>
                              <li>Specialized High-Risk Merchant Accounts.</li>
                              <li>Local Payment Methods for specific regions.</li>
                           </ul>
                        </div>
                     </div>
                     
                     <div className="pt-4">
                        <div className="bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-700/50">
                           <span className="text-gray-500 text-sm">Ask anything...</span>
                           <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                              <ArrowRight size={16} className="text-indigo-400" />
                           </div>
                        </div>
                     </div>
                  </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { content } = useContent();
  const pageContent = content.home;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection content={pageContent.hero} />
        <FeaturesSection content={pageContent.features} />
        <OmaraAISection />
        <TestimonialsSection content={pageContent.testimonials} />
        <CTASection content={pageContent.cta} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;