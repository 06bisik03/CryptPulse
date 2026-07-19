const toFiniteNumber = (value, fallback = 0) => {
  const number = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(number) ? number : fallback;
};

export const normalizeCoin = (coin, index = 0, fallbackCoin = {}) => {
  const source = coin && typeof coin === "object" ? coin : {};
  const fallback = fallbackCoin && typeof fallbackCoin === "object" ? fallbackCoin : {};
  const currentPrice = toFiniteNumber(source.current_price, fallback.current_price || 0);
  const change = toFiniteNumber(
    source.price_change_percentage_24h,
    fallback.price_change_percentage_24h || 0
  );
  const incomingSparkline = source.sparkline_in_7d?.price;
  const fallbackSparkline = fallback.sparkline_in_7d?.price;
  const sparkline = Array.isArray(incomingSparkline)
    ? incomingSparkline.map((point) => toFiniteNumber(point, currentPrice))
    : Array.isArray(fallbackSparkline)
    ? fallbackSparkline
    : [currentPrice, currentPrice];

  return {
    ...fallback,
    ...source,
    id: source.id || fallback.id || `market-${index + 1}`,
    name: source.name || fallback.name || "Unknown asset",
    symbol: source.symbol || fallback.symbol || "--",
    current_price: currentPrice,
    market_cap: toFiniteNumber(source.market_cap, fallback.market_cap || 0),
    market_cap_rank: toFiniteNumber(
      source.market_cap_rank,
      fallback.market_cap_rank || index + 1
    ),
    total_volume: toFiniteNumber(source.total_volume, fallback.total_volume || 0),
    high_24h: toFiniteNumber(source.high_24h, fallback.high_24h || currentPrice),
    low_24h: toFiniteNumber(source.low_24h, fallback.low_24h || currentPrice),
    price_change_24h: toFiniteNumber(
      source.price_change_24h,
      fallback.price_change_24h || 0
    ),
    price_change_percentage_24h: change,
    market_cap_change_percentage_24h: toFiniteNumber(
      source.market_cap_change_percentage_24h,
      change
    ),
    circulating_supply: toFiniteNumber(
      source.circulating_supply,
      fallback.circulating_supply || 0
    ),
    total_supply: toFiniteNumber(source.total_supply, fallback.total_supply || 0),
    ath: toFiniteNumber(source.ath, fallback.ath || currentPrice),
    atl: toFiniteNumber(source.atl, fallback.atl || currentPrice),
    last_updated: source.last_updated || fallback.last_updated || new Date().toISOString(),
    image: typeof source.image === "string" ? source.image : fallback.image || "",
    accent: fallback.accent || "#64fbd2",
    sparkline_in_7d: { price: sparkline.length > 1 ? sparkline : [currentPrice, currentPrice] },
  };
};

export const normalizeCoins = (coins, fallbacks = []) => {
  const source = Array.isArray(coins) && coins.length ? coins : fallbacks;
  return source.map((coin, index) => normalizeCoin(coin, index, fallbacks[index]));
};

export const toNumber = toFiniteNumber;

export const formatCurrency = (value, options = {}) => {
  const number = toFiniteNumber(value);
  const absolute = Math.abs(number);
  const maximumFractionDigits =
    options.maximumFractionDigits ?? (absolute > 1000 ? 2 : absolute >= 1 ? 2 : 6);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits,
  }).format(number);
};

export const formatCompact = (value, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits,
  }).format(toFiniteNumber(value));

export const formatPercent = (value, digits = 2) => {
  const number = toFiniteNumber(value);
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(digits)}%`;
};

export const safeDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Awaiting update"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
};
