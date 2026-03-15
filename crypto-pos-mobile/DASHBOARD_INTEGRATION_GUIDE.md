# Dashboard Integration Guide - Phase 4

## Overview

This guide explains how to integrate the Android POS app with the Omarapay dashboard (app.omarapay.com).

## Current Status

✅ **Infrastructure Ready**: Configuration system is in place
⏳ **Awaiting API Credentials**: Need API documentation and credentials from client

## Configuration Files

### Primary Configuration
- **File**: `src/utils/dashboardConfig.js`
- **Purpose**: Central configuration for API switching and endpoint mapping

### Current Settings

```javascript
// Toggle between local backend and Omarapay API
export const USE_OMARAPAY_API = false; // Set to true when ready

// API Base URLs
export const LOCAL_API_BASE_URL = 'http://192.168.139.90:4000';
export const OMARAPAY_API_BASE_URL = 'https://app.omarapay.com/api';
```

## Integration Steps

### Step 1: Get API Credentials from Client

Request the following information:

1. **API Base URL**
   - Exact URL: `https://app.omarapay.com/api` (confirm)
   - Or: `https://api.omarapay.com` (verify)

2. **Authentication Method**
   - API Key/Secret?
   - Bearer Token (JWT)?
   - OAuth 2.0?
   - Basic Auth?

3. **API Documentation**
   - Postman collection
   - Swagger/OpenAPI docs
   - Endpoint list with request/response examples

4. **Test Credentials**
   - Test API key/token
   - Test company credentials
   - Test cashier credentials

### Step 2: Update Configuration

Once you have the credentials, update `src/utils/dashboardConfig.js`:

```javascript
// 1. Enable Omarapay API
export const USE_OMARAPAY_API = true;

// 2. Update API base URL (if different)
export const OMARAPAY_API_BASE_URL = 'https://app.omarapay.com/api';

// 3. Add authentication credentials
export const OMARAPAY_AUTH = {
  apiKey: 'your-api-key-here',
  apiSecret: 'your-api-secret-here', // if required
  token: 'your-bearer-token-here', // if using bearer token
  authType: 'api_key', // or 'bearer_token', 'oauth', 'basic'
};
```

### Step 3: Update Endpoint Mappings

Update the `API_ENDPOINTS` object in `dashboardConfig.js` to match Omarapay API endpoints:

```javascript
export const API_ENDPOINTS = {
  COMPANY_LOGIN: '/auth/company/login', // Update to match Omarapay
  CASHIER_LIST: '/company/{companyId}/cashiers', // Update if different
  // ... etc
};
```

### Step 4: Test Integration

1. **Test Authentication**
   ```bash
   # Run the app and test company login
   # Verify tokens are received and stored correctly
   ```

2. **Test Payment Flow**
   - Create a test payment
   - Verify it appears in Omarapay dashboard
   - Check payment status updates

3. **Test Receipt Generation**
   - Generate receipt
   - Verify data matches dashboard records

## API Endpoint Mapping

### Expected Endpoints (to be confirmed)

| Local Endpoint | Expected Omarapay Endpoint | Status |
|---------------|---------------------------|--------|
| `/api/pos/company/login` | `/auth/company/login` | ⏳ Pending |
| `/api/pos/company/{id}/cashiers` | `/company/{id}/cashiers` | ⏳ Pending |
| `/api/pos/cashier/login` | `/auth/cashier/login` | ⏳ Pending |
| `/api/payment/create` | `/payments/create` | ⏳ Pending |
| `/api/payment/status/{id}` | `/payments/{id}/status` | ⏳ Pending |
| `/api/payment/crypto-rate/{code}` | `/crypto/rates/{code}` | ⏳ Pending |
| `/api/receipt/{id}` | `/receipts/{id}` | ⏳ Pending |

## Authentication Methods

### Method 1: API Key
```javascript
headers: {
  'X-API-Key': 'your-api-key',
  'X-API-Secret': 'your-api-secret' // if required
}
```

### Method 2: Bearer Token
```javascript
headers: {
  'Authorization': 'Bearer your-token-here'
}
```

### Method 3: Basic Auth
```javascript
headers: {
  'Authorization': 'Basic base64(username:password)'
}
```

## Environment Variables (Optional)

For production, you can use environment variables:

```bash
# .env file (do not commit to git)
OMARAPAY_API_KEY=your-api-key
OMARAPAY_API_SECRET=your-api-secret
OMARAPAY_API_BASE_URL=https://app.omarapay.com/api
USE_OMARAPAY_API=true
```

Then update `dashboardConfig.js`:
```javascript
export const OMARAPAY_AUTH = {
  apiKey: process.env.OMARAPAY_API_KEY || '',
  // ...
};
```

## Error Handling

The API client automatically handles:
- Network errors
- Authentication failures
- Rate limiting
- Server errors

All errors are logged and displayed to the user appropriately.

## Testing Checklist

- [ ] Company login works with Omarapay API
- [ ] Cashier list loads from Omarapay
- [ ] Cashier login works
- [ ] Payment creation syncs to dashboard
- [ ] Payment status updates correctly
- [ ] Receipt data matches dashboard
- [ ] Transaction history loads
- [ ] Error handling works correctly

## Troubleshooting

### Issue: "Cannot connect to server"
- Check `USE_OMARAPAY_API` is set correctly
- Verify `OMARAPAY_API_BASE_URL` is correct
- Check network connectivity
- Verify API credentials are correct

### Issue: "Authentication failed"
- Check API key/token is correct
- Verify auth type matches Omarapay setup
- Check token expiration
- Verify headers are being sent correctly

### Issue: "Endpoint not found"
- Update endpoint mappings in `dashboardConfig.js`
- Verify endpoint paths match Omarapay API
- Check if endpoints require different base URL

## Support

When integrating:
1. Enable debug logging: Check console for API requests/responses
2. Test with Postman first: Verify endpoints work outside app
3. Use network inspector: Check actual HTTP requests being sent
4. Contact Omarapay support: For API-specific questions

## Next Steps

1. **Request from Client:**
   - API documentation
   - Test credentials
   - Endpoint list
   - Authentication method

2. **Update Configuration:**
   - Set `USE_OMARAPAY_API = true`
   - Add credentials
   - Update endpoint mappings

3. **Test Integration:**
   - Run full test suite
   - Verify all flows work
   - Check data sync

4. **Deploy:**
   - Update production config
   - Monitor for errors
   - Verify dashboard sync

---

**Status**: ⏳ Awaiting API credentials and documentation from client
