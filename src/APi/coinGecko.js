const BASE_URL = "https://api.coingecko.com/api/v3";
const cache = new Map();
const CACHE_DURATION = 60 * 1000;
const cachedFetch = async (url) => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data; 
  }

  const response = await fetch(url);

  if (response.status === 429) {
    await new Promise((res) => setTimeout(res, 10000));
    return cachedFetch(url);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() }); // store in cache
  return data;
};

export const fetchCryptos = async () => {
  return cachedFetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );
};

export const fetchCoinData = async (id) => {
  return cachedFetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
};

export const fetchChartData = async (id) => {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return response.json();
};