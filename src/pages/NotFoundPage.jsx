import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAuth();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Simple mock search functionality - could redirect to a search page in future
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
             <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
          >
             <h1 className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900 bg-clip-text text-transparent select-none drop-shadow-sm">
                404
             </h1>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-4"
          >
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Page not found
             </h2>
             <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
             </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="max-w-md mx-auto"
          >
             <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search pages..." 
                  className="pl-10 h-12 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20"
                />
             </form>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
             <Button size="lg" onClick={() => navigate(-1)} variant="outline" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Go Back
             </Button>
             
             <Link to="/">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                   <Home className="mr-2 h-4 w-4" /> Home Page
                </Button>
             </Link>

             {isConnected && (
                <Link to="/dashboard">
                   <Button size="lg" variant="secondary">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                   </Button>
                </Link>
             )}
          </motion.div>
          
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
             <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
             <Link to="/business-locator" className="hover:text-primary transition-colors">Business Locator</Link>
             <Link to="/contact" className="hover:text-primary transition-colors">Help Center</Link>
             <Link to="/ai-assistant" className="hover:text-primary transition-colors">AI Assistant</Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;