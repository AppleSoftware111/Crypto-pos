/**
 * Receipt Template Utility
 * Generates formatted receipt text for thermal printers
 */

/**
 * Format receipt text for thermal printer
 * @param {Object} receiptData - Receipt data
 * @returns {string} Formatted receipt text
 */
export const formatReceipt = (receiptData) => {
  const {
    companyName = 'OMARA Pay',
    cashierName = 'Cashier',
    paymentId,
    date,
    time,
    amount,
    cryptoAmount,
    method,
    symbol,
    address,
    phoneNumber,
    securityCode,
    txHash,
    status = 'pending',
  } = receiptData;

  const line = '─'.repeat(32);
  const center = (text, width = 32) => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  let receipt = '';

  // Header
  receipt += center(companyName.toUpperCase()) + '\n';
  receipt += center('POS TERMINAL') + '\n';
  receipt += line + '\n';

  // Cashier Info
  receipt += `Cashier: ${cashierName}\n`;
  receipt += `Date: ${date || new Date().toLocaleDateString()}\n`;
  receipt += `Time: ${time || new Date().toLocaleTimeString()}\n`;
  receipt += line + '\n';

  // Payment Details
  receipt += center('PAYMENT RECEIPT') + '\n';
  receipt += line + '\n';
  receipt += `Payment ID:\n${paymentId || 'N/A'}\n`;
  receipt += line + '\n';

  // Amount
  if (cryptoAmount !== undefined) {
    receipt += `Amount (${symbol || method}):\n`;
    receipt += `${cryptoAmount.toFixed(8)} ${symbol || ''}\n`;
    receipt += line + '\n';
  }

  if (amount !== undefined) {
    receipt += `Amount (USD):\n`;
    receipt += `$${amount.toFixed(2)}\n`;
    receipt += line + '\n';
  }

  receipt += `Payment Method:\n${method || 'N/A'}\n`;
  receipt += line + '\n';

  // Customer Info
  if (phoneNumber) {
    receipt += `Phone: ${phoneNumber}\n`;
  }
  if (securityCode) {
    receipt += `Security Code: ${securityCode}\n`;
  }
  receipt += line + '\n';

  // Wallet Address
  if (address) {
    receipt += `Wallet Address:\n${address}\n`;
    receipt += line + '\n';
  }

  // Transaction Hash
  if (txHash) {
    receipt += `Transaction Hash:\n${txHash}\n`;
    receipt += line + '\n';
  }

  // Status
  receipt += `Status: ${status.toUpperCase()}\n`;
  receipt += line + '\n';

  // Footer
  receipt += center('Thank you for your payment!') + '\n';
  receipt += center('Scan QR code to pay') + '\n';
  receipt += '\n\n\n'; // Feed lines for cutting

  return receipt;
};

/**
 * Generate receipt HTML for preview/PDF
 */
export const generateReceiptHTML = (receiptData) => {
  const {
    companyName = 'OMARA Pay',
    cashierName = 'Cashier',
    paymentId,
    date,
    time,
    amount,
    cryptoAmount,
    method,
    symbol,
    address,
    phoneNumber,
    securityCode,
    txHash,
    status = 'pending',
    qrCodeData,
  } = receiptData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Courier New', monospace;
          width: 80mm;
          margin: 0 auto;
          padding: 10px;
          font-size: 12px;
        }
        .header {
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .line {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .center {
          text-align: center;
        }
        .label {
          font-weight: bold;
        }
        .qr-code {
          text-align: center;
          margin: 20px 0;
        }
        .qr-code img {
          max-width: 200px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">${companyName.toUpperCase()}</div>
      <div class="center">POS TERMINAL</div>
      <div class="line"></div>
      
      <div>Cashier: ${cashierName}</div>
      <div>Date: ${date || new Date().toLocaleDateString()}</div>
      <div>Time: ${time || new Date().toLocaleTimeString()}</div>
      <div class="line"></div>
      
      <div class="center"><strong>PAYMENT RECEIPT</strong></div>
      <div class="line"></div>
      
      <div class="label">Payment ID:</div>
      <div>${paymentId || 'N/A'}</div>
      <div class="line"></div>
      
      ${cryptoAmount !== undefined ? `
        <div class="label">Amount (${symbol || method}):</div>
        <div>${cryptoAmount.toFixed(8)} ${symbol || ''}</div>
        <div class="line"></div>
      ` : ''}
      
      ${amount !== undefined ? `
        <div class="label">Amount (USD):</div>
        <div>$${amount.toFixed(2)}</div>
        <div class="line"></div>
      ` : ''}
      
      <div class="label">Payment Method:</div>
      <div>${method || 'N/A'}</div>
      <div class="line"></div>
      
      ${phoneNumber ? `<div>Phone: ${phoneNumber}</div>` : ''}
      ${securityCode ? `<div>Security Code: ${securityCode}</div>` : ''}
      <div class="line"></div>
      
      ${address ? `
        <div class="label">Wallet Address:</div>
        <div style="word-break: break-all; font-size: 10px;">${address}</div>
        <div class="line"></div>
      ` : ''}
      
      ${txHash ? `
        <div class="label">Transaction Hash:</div>
        <div style="word-break: break-all; font-size: 10px;">${txHash}</div>
        <div class="line"></div>
      ` : ''}
      
      ${qrCodeData ? `
        <div class="qr-code">
          <img src="${qrCodeData}" alt="QR Code" />
        </div>
      ` : ''}
      
      <div>Status: <strong>${status.toUpperCase()}</strong></div>
      <div class="line"></div>
      
      <div class="footer">
        <div>Thank you for your payment!</div>
        <div>Scan QR code to pay</div>
      </div>
    </body>
    </html>
  `;
};
