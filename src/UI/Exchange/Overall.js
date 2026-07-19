import styles from "./Overall.module.css";
import { formatCurrency, formatPercent } from "../../utils/market";

const Overall = ({ data = {} }) => {
  const change = Number(data.market_cap_change_percentage_24h_usd) || 0;
  return (
    <header className={styles.container}>
      <div>
        <span className={styles.eyebrow}>Daily market brief</span>
        <h1>The signal room</h1>
        <p>A compressed view of leadership, momentum and areas of market stress.</p>
      </div>
      <div className={styles.marketCallout}>
        <span>Global market value</span>
        <strong>{formatCurrency(data.total_market_cap?.usd, { compact: true })}</strong>
        <small className={change < 0 ? styles.negative : ""}>{formatPercent(change)} in 24 hours</small>
      </div>
    </header>
  );
};

export default Overall;
