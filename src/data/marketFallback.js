const makeSparkline = (price, change, seed) => {
  const points = 72;
  const start = price / (1 + change / 100 || 1);

  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const trend = start + (price - start) * progress;
    const wave = Math.sin(progress * Math.PI * (4 + seed)) * price * 0.012;
    const texture = Math.cos(progress * Math.PI * 13) * price * 0.003;
    return Math.max(trend + wave + texture, price * 0.05);
  });
};

const rawCoins = [
  ["bitcoin", "Bitcoin", "btc", 118420, 2.84, 2350000000000, 43600000000, 21000000, "#f5b942"],
  ["ethereum", "Ethereum", "eth", 3764.82, 1.72, 454000000000, 21800000000, 120710000, "#8aa4ff"],
  ["tether", "Tether", "usdt", 1, 0.02, 137000000000, 72800000000, 137100000000, "#39d8a2"],
  ["binancecoin", "BNB", "bnb", 721.34, -0.74, 105000000000, 1810000000, 145900000, "#f2cf42"],
  ["solana", "Solana", "sol", 184.67, 4.91, 89000000000, 4920000000, 590000000, "#62f3c6"],
  ["usd-coin", "USDC", "usdc", 0.9998, -0.01, 62000000000, 10700000000, 62200000000, "#4f8cff"],
  ["ripple", "XRP", "xrp", 2.19, -1.46, 129000000000, 3890000000, 99980000000, "#dbe5ed"],
  ["dogecoin", "Dogecoin", "doge", 0.2114, 3.28, 31500000000, 2310000000, 149200000000, "#d6bb61"],
  ["cardano", "Cardano", "ada", 0.8241, -2.13, 29200000000, 940000000, 45000000000, "#4c9dff"],
  ["avalanche-2", "Avalanche", "avax", 42.63, 5.16, 17800000000, 712000000, 457000000, "#ff5c69"],
  ["chainlink", "Chainlink", "link", 19.42, 2.07, 12700000000, 834000000, 1000000000, "#5271ff"],
  ["polkadot", "Polkadot", "dot", 7.88, -0.89, 11900000000, 305000000, 1510000000, "#ff4e9d"],
];

export const fallbackCoins = rawCoins.map((coin, index) => {
  const [id, name, symbol, price, change, marketCap, volume, supply, accent] = coin;
  const absoluteChange = price * (change / 100);

  return {
    id,
    name,
    symbol,
    current_price: price,
    market_cap: marketCap,
    market_cap_rank: index + 1,
    total_volume: volume,
    high_24h: price * 1.028,
    low_24h: price * 0.972,
    price_change_24h: absoluteChange,
    price_change_percentage_24h: change,
    market_cap_change_percentage_24h: change * 0.91,
    circulating_supply: supply * 0.91,
    total_supply: supply,
    ath: price * 1.32,
    atl: Math.max(price * 0.08, 0.00001),
    last_updated: new Date().toISOString(),
    image: "",
    accent,
    sparkline_in_7d: { price: makeSparkline(price, change, index + 1) },
  };
});

export const fallbackGlobal = {
  total_market_cap: { usd: 3840000000000 },
  total_volume: { usd: 163000000000 },
  market_cap_percentage: { btc: 54.8, eth: 12.6 },
  market_cap_change_percentage_24h_usd: 1.64,
  active_cryptocurrencies: 17240,
  markets: 1124,
};

export const fallbackTrending = fallbackCoins.slice(0, 8);
