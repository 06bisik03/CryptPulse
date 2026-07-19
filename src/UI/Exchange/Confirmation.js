import { useState } from "react";
import { buyCoin } from "../../firebase";
import styles from "./Confirmation.module.css";
import Purchased from "./Purchased";
import { formatCurrency } from "../../utils/market";

const Confirmation = ({ data, onCancel }) => {
  const [state, setState] = useState("review");
  const [error, setError] = useState("");

  const handleCoinPurchase = async () => {
    setState("submitting");
    setError("");
    const currentTime = Date.now();
    const transactionDetails = {
      userLogged: localStorage.getItem("userLogged"),
      coinID: data.coin.id,
      coinAmount: Number(data.formData.coinAmount),
      coinBuyPrice: Number(data.coin.current_price),
      coinSymbol: data.coin.symbol,
      coinName: data.coin.name,
      totalSum: Number(data.formData.price),
      coinImage: data.coin.image,
      coinLastUpdate: data.coin.last_updated,
      timeOfBuy: currentTime,
    };

    try {
      const purchased = await buyCoin(transactionDetails);
      if (purchased) setState("success");
      else { setState("review"); setError("Your wallet balance is not sufficient for this order."); }
    } catch {
      setState("review");
      setError("The order could not be completed. Your balance was not changed.");
    }
  };

  if (state === "success") {
    return <Purchased amountOfCrypto={data.formData.coinAmount} typeOfCrypto={data.coin.symbol} />;
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="order-title">
      <div className={styles.container}>
        <span className={styles.kicker}>Final review</span>
        <h2 id="order-title">Confirm market order</h2>
        <p>You are buying <strong>{Number(data.formData.coinAmount).toLocaleString(undefined, { maximumFractionDigits: 8 })} {data.coin.symbol.toUpperCase()}</strong> at the current market rate.</p>
        <div className={styles.summary}>
          <span>Estimated total</span><strong>{formatCurrency(data.formData.price)}</strong>
        </div>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <div className={styles.buttons}>
          <button type="button" onClick={onCancel} disabled={state === "submitting"}>Cancel</button>
          <button type="button" onClick={handleCoinPurchase} disabled={state === "submitting"}>{state === "submitting" ? "Executing…" : "Confirm buy"}</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
