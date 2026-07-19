import { Link } from "react-router-dom";
import styles from "./TableCoin.module.css";
import CryptoChart from "./CryptoChart";
import { formatCompact, formatCurrency, formatPercent, toNumber } from "../../utils/market";

const TableCoin = ({ coin }) => {
  const change = toNumber(coin.price_change_percentage_24h);
  const negative = change < 0;
  const tradePath = `/exchange/coin=${encodeURIComponent(coin.id)}+${encodeURIComponent(coin.name)}`;

  return (
    <div className={styles.container} role="row">
      <div className={styles.rank} role="cell">{coin.market_cap_rank || "—"}</div>
      <Link to={tradePath} className={styles.asset} role="cell">
        {coin.image ? (
          <img src={coin.image} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        ) : (
          <span className={styles.coinMark} style={{ "--coin": coin.accent }}>{coin.symbol.slice(0, 1).toUpperCase()}</span>
        )}
        <span className={styles.identity}>
          <strong>{coin.name}</strong>
          <small>{coin.symbol.toUpperCase()}</small>
        </span>
      </Link>
      <div className={styles.price} role="cell">{formatCurrency(coin.current_price)}</div>
      <div className={`${styles.change} ${negative ? styles.negative : ""}`} role="cell">
        {formatPercent(change)}
      </div>
      <div className={styles.cap} role="cell">{formatCurrency(coin.market_cap, { compact: true })}</div>
      <div className={styles.volume} role="cell">{formatCurrency(coin.total_volume, { compact: true })}</div>
      <div className={styles.chart} role="cell">
        <CryptoChart
          data={coin.sparkline_in_7d?.price}
          displacement={negative}
          size={{ widthS: 260, heightS: 70, heightT: 44 }}
          area={false}
        />
      </div>
      <div className={styles.action} role="cell">
        <Link className={styles.tradeBtn} to={tradePath} aria-label={`Trade ${coin.name}`}>↗</Link>
      </div>
    </div>
  );
};

export default TableCoin;

export function formatNumber(number) {
  return formatCompact(number, 1);
}
