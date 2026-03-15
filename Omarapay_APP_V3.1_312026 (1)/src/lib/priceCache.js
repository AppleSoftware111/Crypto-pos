const CACHE_KEY = 'omara_price_cache';
const TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches crypto prices from CoinGecko with caching
 * @param {string[]} ids - Array of CoinGecko coin IDs (e.g. ['bitcoin', 'ethereum'])
 * @param {string} vs_currency - Target currency (default 'usd')
 * @returns {Promise<Object>} - Object with prices
 */
export const getCryptoPrices = async (ids = ['ethereum', 'tether', 'usd-coin'], vs_currency = 'usd') => {
  const cacheKey = `${CACHE_KEY}_${ids.join('_')}_${vs_currency}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < TTL) {
      return data;
    }
  }

  try {
    // Free CoinGecko API has rate limits, handle gracefully
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${vs_currency}`
    );
    
    if (!response.ok) throw new Error('Price API failed');
    
    const data = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data
    }));

    return data;
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    // Return cached data if available even if expired, otherwise empty
    if (cached) return JSON.parse(cached).data;
    return {};
  }
};

/**
 * Fetches fiat exchange rates (Base USD)
 * Using a free API fallback if needed, or approximating via CoinGecko stablecoins
 */
export const getFiatRates = async () => {
  const cacheKey = 'omara_fiat_rates';
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < TTL) {
      return data;
    }
  }

  try {
    // Using CoinGecko to get USD rates for EUR, PHP via stablecoin proxies or direct forex if supported
    // Since CoinGecko is crypto-focused, we might use a different free API or derive from USDT prices in those currencies
    // Strategy: Get Bitcoin price in USD, EUR, PHP and derive rates
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd,eur,php`
    );
    
    if (!response.ok) throw new Error('Fiat Rate API failed');
    
    const data = await response.json();
    const tether = data.tether; // { usd: 1.00, eur: 0.92, php: 56.50 }

    // Derive rates relative to USD (assuming USDT ~= 1 USD)
    const rates = {
        USD: 1,
        EUR: tether.eur / tether.usd,
        PHP: tether.php / tether.usd
    };

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: rates
    }));

    return rates;
  } catch (error) {
    console.error('Failed to fetch fiat rates:', error);
    // Fallback to static if API fails completely
    return { USD: 1, EUR: 0.92, PHP: 56.0 }; 
  }
};