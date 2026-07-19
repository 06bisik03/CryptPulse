import styles from "./PastTransaction.module.css";
import { formatCurrency, toNumber } from "../../utils/market";

const PastTransaction = ({ transaction = {} }) => {
  const isPurchase = Boolean(transaction.timeOfBuy);
  const timestamp = transaction.timeOfBuy || transaction.timeOfSell;
  const date = new Date(timestamp);
  const dateLabel = Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" });
  const symbol = String(transaction.coinSymbol || "--").toUpperCase();
  const units = toNumber(transaction.coinAmount);

  return (
    <div className={styles.container}>
      <div className={styles.date}>{dateLabel}</div>
      <div className={styles.asset}>
        {transaction.coinImage ? <img alt="" src={transaction.coinImage} /> : <span>{symbol.slice(0,1)}</span>}
        <div><strong>{transaction.coinName || "Unknown asset"}</strong><small>{symbol}</small></div>
      </div>
      <div className={`${styles.type} ${!isPurchase ? styles.sale : ""}`}>{isPurchase ? "Buy" : "Sell"}</div>
      <div className={styles.units}>{isPurchase ? "+" : "-"}{units.toLocaleString(undefined, { maximumFractionDigits: 8 })} {symbol}</div>
      <div className={styles.total}>{formatCurrency(transaction.totalSum)}</div>
    </div>
  );
};

export default PastTransaction;
