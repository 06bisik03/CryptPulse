import { Link } from "react-router-dom";
import styles from "./ElementFilter.module.css";
import CryptoChart from "./CryptoChart";
import { formatCurrency, formatPercent } from "../../utils/market";

const ElementFilter = ({ coin }) => {
  const negative = coin.price_change_percentage_24h < 0;
  return (
    <Link to={`/exchange/coin=${coin.id}+${coin.name}`} className={styles.container}>
      <div className={styles.topline}>
        <span className={styles.mark} style={{ "--coin": coin.accent }}>{coin.symbol.slice(0, 1).toUpperCase()}</span>
        <span className={styles.symbol}>{coin.symbol.toUpperCase()}<small>{coin.name}</small></span>
        <span className={`${styles.change} ${negative ? styles.negative : ""}`}>{formatPercent(coin.price_change_percentage_24h)}</span>
      </div>
      <div className={styles.bottomline}>
        <strong>{formatCurrency(coin.current_price)}</strong>
        <div className={styles.chart}>
          <CryptoChart data={coin.sparkline_in_7d?.price} displacement={negative} size={{ widthS: 240, heightS: 62, heightT: 42 }} />
        </div>
      </div>
    </Link>
  );
};

export default ElementFilter;
