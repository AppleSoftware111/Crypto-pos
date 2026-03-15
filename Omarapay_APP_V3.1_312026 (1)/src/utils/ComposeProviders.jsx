import React from 'react';

/**
 * Utility component to compose multiple providers together.
 * This flattens the React tree and makes App.jsx much cleaner.
 * 
 * Usage:
 * <ComposeProviders components={[Provider1, [Provider2, props], Provider3]}>
 *   <App />
 * </ComposeProviders>
 */
const ComposeProviders = ({ components = [], children }) => {
  return (
    <>
      {components.reduceRight((acc, Curr) => {
        // Handle [Provider, props] syntax
        const [Provider, props] = Array.isArray(Curr) ? Curr : [Curr, {}];
        
        return <Provider {...props}>{acc}</Provider>;
      }, children)}
    </>
  );
};

export default ComposeProviders;