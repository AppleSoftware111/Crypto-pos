import React from 'react';
import WithdrawPage from './WithdrawPage';

const SendMoneyPage = ({ embedded = false }) => {
  // Reusing WithdrawPage with a default "P2P" focus could be done here if needed
  // For now, it works as is
  return <WithdrawPage embedded={embedded} />;
};

export default SendMoneyPage;