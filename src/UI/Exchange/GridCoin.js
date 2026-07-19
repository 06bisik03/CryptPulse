import styles from "./GridCoin.module.css";
import CryptoChart from "./CryptoChart";
import { formatCompact, formatCurrency, formatPercent, safeDateTime } from "../../utils/market";

const GridCoin = ({ coin }) => {
  const negative = coin.price_change_percentage_24h < 0;
  const stats = [
    ["Market cap", formatCurrency(coin.market_cap, { compact: true })],
    ["24h volume", formatCurrency(coin.total_volume, { compact: true })],
    ["24h high", formatCurrency(coin.high_24h)],
    ["24h low", formatCurrency(coin.low_24h)],
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.identity}>
          {coin.image ? <img src={coin.image} alt="" /> : <span className={styles.mark} style={{ "--coin": coin.accent }}>{coin.symbol.slice(0, 1).toUpperCase()}</span>}
          <div><h1>{coin.name}</h1><span>{coin.symbol.toUpperCase()} / USD</span></div>
        </div>
        <div className={styles.marketState}><i /> Spot market</div>
      </div>

      <div className={styles.quote}>
        <div>
          <span>Last price</span>
          <strong>{formatCurrency(coin.current_price)}</strong>
        </div>
        <div className={`${styles.momentum} ${negative ? styles.negative : ""}`}>
          <span>24h change</span>
          <strong>{formatPercent(coin.price_change_percentage_24h)}</strong>
          <small>{formatCurrency(coin.price_change_24h)}</small>
        </div>
      </div>

      <div className={styles.chartFrame}>
        <div className={styles.chartControls}>
          <span>Price / 7 days</span>
          <div><button className={styles.active}>7D</button><button disabled>1M</button><button disabled>1Y</button></div>
        </div>
        <div className={styles.grid} aria-hidden="true" />
        <CryptoChart
          className={styles.chart}
          data={coin.sparkline_in_7d?.price}
          displacement={negative}
          size={{ widthS: 1100, heightS: 430, heightT: 380 }}
          strokeWidth={2.4}
        />
        <div className={styles.chartFooter}>
          <span>7 days ago</span><span>{safeDateTime(coin.last_updated)}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>
  );
};

export default GridCoin;

export function formatNumber2(number) {
  return formatCompact(number);
}
