import React from 'react';
import { useContent } from '@/context/ContentContext.js';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/services/PageHeader';
import ContactFormSection from '@/components/contact/ContactFormSection';
import ContactInfoSection from '@/components/contact/ContactInfoSection';
import FAQSection from '@/components/contact/FAQSection';
import { contactDetailsData, faqsData } from '@/data/contactData';

const ContactPage = () => {
  const { content } = useContent();
  const pageContent = content.contact;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <PageHeader 
          title={pageContent.header.title}
          subtitle={pageContent.header.subtitle}
        />
        
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactFormSection />
              <ContactInfoSection details={contactDetailsData} />
            </div>
          </div>
        </section>

        <FAQSection faqs={faqsData} />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;