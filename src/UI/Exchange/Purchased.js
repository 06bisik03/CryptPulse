import styles from "./Purchased.module.css";
import { Link } from "react-router-dom";

const Purchased = ({ sell, amountOfCrypto, typeOfCrypto, onCancel }) => (
  <div className={styles.backdrop} role="dialog" aria-modal="true">
    <div className={styles.container}>
      <div className={styles.icon}>✓</div>
      <span className={styles.kicker}>Order complete</span>
      <h2>{sell ? "Position reduced" : "Asset acquired"}</h2>
      <p>
        {sell
          ? `${sell.sellAmount} ${sell.coinName} was sold successfully.`
          : `${amountOfCrypto} ${String(typeOfCrypto).toUpperCase()} has been added to your portfolio.`}
      </p>
      {sell ? (
        <button type="button" onClick={onCancel}>Return to portfolio</button>
      ) : (
        <Link to="/profile">View portfolio <span>→</span></Link>
      )}
    </div>
  </div>
);

export default Purchased;
