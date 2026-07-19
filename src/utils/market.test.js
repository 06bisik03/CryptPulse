import { fallbackCoins } from "../data/marketFallback";
import {
  formatCurrency,
  formatPercent,
  normalizeCoin,
  normalizeCoins,
} from "./market";

describe("market data normalization", () => {
  test("replaces nullable API fields with finite values", () => {
    const coin = normalizeCoin(
      {
        id: "nullable-coin",
        name: "Nullable Coin",
        symbol: "null",
        current_price: null,
        market_cap: null,
        price_change_24h: null,
        price_change_percentage_24h: null,
        sparkline_in_7d: { price: [null, "12.5", undefined] },
      },
      0,
      fallbackCoins[0]
    );

    expect(Number.isFinite(coin.current_price)).toBe(true);
    expect(Number.isFinite(coin.market_cap)).toBe(true);
    expect(Number.isFinite(coin.price_change_24h)).toBe(true);
    expect(Number.isFinite(coin.price_change_percentage_24h)).toBe(true);
    expect(coin.sparkline_in_7d.price.every(Number.isFinite)).toBe(true);
  });

  test("uses deterministic fallback assets for invalid responses", () => {
    const coins = normalizeCoins({ error: "rate limited" }, fallbackCoins);

    expect(coins).toHaveLength(fallbackCoins.length);
    expect(coins[0]).toMatchObject({ id: "bitcoin", symbol: "btc" });
  });

  test("formatters never throw for missing values", () => {
    expect(() => formatCurrency(null)).not.toThrow();
    expect(() => formatPercent(undefined)).not.toThrow();
    expect(formatCurrency(null)).toContain("$0");
    expect(formatPercent(undefined)).toBe("0.00%");
  });
});
