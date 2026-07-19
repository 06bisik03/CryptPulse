import { useState } from "react";
import styles from "./SellConfirmation.module.css";
import { sellCoin } from "../../firebase";
import { formatCurrency, toNumber } from "../../utils/market";

const SellConfirmation = ({ dataGeneral, dataCurrent, onCancel, successFullSale, errorSale }) => {
  const market = dataCurrent?.[0];
  const owned = toNumber(dataGeneral?.coinAmount);
  const price = toNumber(market?.current_price);
  const [sellAmount, setSellAmount] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const proceeds = toNumber(sellAmount) * price;

  const submitHandler = async (event) => {
    event.preventDefault();
    const amount = Number(sellAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > owned) {
      setError(`Enter an amount between 0 and ${owned.toLocaleString(undefined, { maximumFractionDigits: 8 })}.`);
      return;
    }
    setPending(true);
    setError("");
    const sold = await sellCoin({
      userLogged: localStorage.getItem("userLogged"),
      coinName: dataGeneral.coinName,
      coinAmount: amount,
      coinID: market.id,
      totalSum: proceeds,
      coinImage: market.image,
      timeOfSell: Date.now(),
      coinSymbol: market.symbol,
    });
    if (sold) successFullSale(amount, proceeds);
    else errorSale();
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="sell-title">
      <form className={styles.form} onSubmit={submitHandler}>
        <span className={styles.kicker}>Reduce position</span>
        <h2 id="sell-title">Sell {dataGeneral.coinName}</h2>
        <p>You currently hold {owned.toLocaleString(undefined, { maximumFractionDigits: 8 })} {String(dataGeneral.coinSymbol).toUpperCase()}.</p>
        <label><span>Units to sell</span><input type="number" min="0" max={owned} step="any" value={sellAmount} onChange={(event) => { setSellAmount(event.target.value); setError(""); }} placeholder="0.00000000" /></label>
        <div className={styles.summary}><span>Estimated proceeds</span><strong>{formatCurrency(proceeds)}</strong></div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}><button type="button" onClick={onCancel} disabled={pending}>Cancel</button><button type="submit" disabled={pending}>{pending ? "Executing…" : "Confirm sale"}</button></div>
      </form>
    </div>
  );
};

export default SellConfirmation;
