import styles from "./Card.module.css";
import { formatCurrency, toNumber } from "../../utils/market";

const maskCard = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  return digits ? `•••• •••• •••• ${digits.slice(-4).padStart(4, "•")}` : "Card unavailable";
};

const Card = ({ data = {} }) => (
  <div className={styles.container}>
    <div className={styles.issuer}>
      {data.cardImageUrl ? <img alt="" src={data.cardImageUrl} /> : <span>{String(data.type || "Card").slice(0, 2).toUpperCase()}</span>}
    </div>
    <div className={styles.number}>{maskCard(data.cardNum)}</div>
    <div className={styles.holder}>{data.holderName || "Unknown holder"}</div>
    <div className={styles.expiry}>{data.expDate || "--/----"}</div>
    <div className={styles.funded}>{formatCurrency(toNumber(data.totalSum))}</div>
  </div>
);

export default Card;
