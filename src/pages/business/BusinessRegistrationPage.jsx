import React from 'react';
import StandardPageWrapper from '@/components/layout/StandardPageWrapper';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';

const BusinessRegistrationPage = () => {
    return (
        <StandardPageWrapper 
            title="Create Merchant Account" 
            subtitle="Start accepting payments and growing your business in just a few minutes."
        >
            <BusinessRegistrationForm />
        </StandardPageWrapper>
    );
};

export default BusinessRegistrationPage;