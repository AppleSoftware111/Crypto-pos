import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import SectionWrapper from '@/components/services/SectionWrapper';
import PageHeader from '@/components/services/PageHeader';
import IndustriesServed from '@/components/services/IndustriesServed';
import CTAServiceSection from '@/components/services/CTAServiceSection';
import { coreServices, advancedServices } from '@/data/servicesData.js';

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title="Our Services"
          subtitle="Comprehensive payment solutions designed to help your business thrive."
        />

        <SectionWrapper title="Core Payment Solutions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="Advanced & Custom Solutions" className="bg-gray-50 dark:bg-gray-900">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedServices.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </SectionWrapper>
        
        <IndustriesServed />
        <CTAServiceSection />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;