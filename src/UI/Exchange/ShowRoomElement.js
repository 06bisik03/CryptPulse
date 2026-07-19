import { Link } from "react-router-dom";
import styles from "./ShowRoomElement.module.css";
import { formatCurrency, formatPercent } from "../../utils/market";

const ShowRoomElement = ({ coin }) => {
  const negative = coin.price_change_percentage_24h < 0;
  return (
    <Link to={`/exchange/coin=${coin.id}+${coin.name}`} className={styles.container}>
      <span className={styles.rank}>{String(coin.market_cap_rank).padStart(2, "0")}</span>
      <span className={styles.mark} style={{ "--coin": coin.accent }}>{coin.symbol.slice(0, 1).toUpperCase()}</span>
      <span className={styles.name}><strong>{coin.name}</strong><small>{coin.symbol.toUpperCase()}</small></span>
      <span className={styles.price}><strong>{formatCurrency(coin.current_price)}</strong><small className={negative ? styles.negative : ""}>{formatPercent(coin.price_change_percentage_24h)}</small></span>
      <span className={styles.arrow}>↗</span>
    </Link>
  );
};

export default ShowRoomElement;
