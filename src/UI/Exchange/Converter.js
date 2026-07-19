import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Converter.module.css";
import Confirmation from "./Confirmation";
import AuthContext from "../../Store/user-ctx";
import { formatCompact, formatCurrency } from "../../utils/market";

const Converter = ({ coin }) => {
  const auth = useContext(AuthContext);
  const [usdAmount, setUsdAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const rate = Number(coin.current_price) || 0;

  const updateFromCoin = (value) => {
    setCoinAmount(value);
    const amount = Number(value);
    setUsdAmount(Number.isFinite(amount) && amount >= 0 ? (amount * rate).toFixed(2) : "");
    setError("");
  };

  const updateFromUsd = (value) => {
    setUsdAmount(value);
    const amount = Number(value);
    setCoinAmount(Number.isFinite(amount) && amount >= 0 && rate > 0 ? (amount / rate).toFixed(8) : "");
    setError("");
  };

  const reviewOrder = (event) => {
    event.preventDefault();
    if (Number(usdAmount) <= 0 || Number(coinAmount) <= 0) {
      setError("Enter a positive amount to review this order.");
      return;
    }
    setShowConfirmation(true);
  };

  const stats = [
    ["24h range", `${formatCurrency(coin.low_24h)} — ${formatCurrency(coin.high_24h)}`],
    ["Circulating supply", `${formatCompact(coin.circulating_supply)} ${coin.symbol.toUpperCase()}`],
    ["Total supply", `${formatCompact(coin.total_supply)} ${coin.symbol.toUpperCase()}`],
    ["All-time high", formatCurrency(coin.ath)],
    ["All-time low", formatCurrency(coin.atl)],
  ];

  return (
    <aside className={styles.container}>
      {showConfirmation && (
        <Confirmation
          data={{ coin, formData: { coinAmount, price: usdAmount } }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      <div className={styles.ticket}>
        <div className={styles.ticketHeader}>
          <div><span>Order ticket</span><h2>Buy {coin.symbol.toUpperCase()}</h2></div>
          <span className={styles.spot}>Spot</span>
        </div>

        <form onSubmit={reviewOrder}>
          <label>
            <span>You pay</span>
            <div className={styles.inputGroup}>
              <input type="number" min="0" step="any" inputMode="decimal" placeholder="0.00" value={usdAmount} onChange={(event) => updateFromUsd(event.target.value)} />
              <strong>USD</strong>
            </div>
          </label>
          <div className={styles.swap} aria-hidden="true">↓</div>
          <label>
            <span>You receive</span>
            <div className={styles.inputGroup}>
              <input type="number" min="0" step="any" inputMode="decimal" placeholder="0.00000000" value={coinAmount} onChange={(event) => updateFromCoin(event.target.value)} />
              <strong>{coin.symbol.toUpperCase()}</strong>
            </div>
          </label>

          <div className={styles.rate}><span>Market rate</span><strong>1 {coin.symbol.toUpperCase()} = {formatCurrency(rate)}</strong></div>
          {error && <p className={styles.error} role="alert">{error}</p>}

          {auth.isLoggedIn ? (
            <button className={styles.buyButton} type="submit">Review order <span>↗</span></button>
          ) : (
            <Link className={styles.buyButton} to="/profile">Sign in to trade <span>↗</span></Link>
          )}
          <p className={styles.disclaimer}>Market orders execute at the available price. Digital assets involve risk.</p>
        </form>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsTitle}><span>Asset data</span><small>USD</small></div>
        {stats.map(([label, value]) => <div className={styles.stat} key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </aside>
  );
};

export default Converter;
