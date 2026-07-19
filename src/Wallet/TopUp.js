import { useMemo, useState } from "react";
import styles from "./TopUp.module.css";
import { fundWallet } from "../firebase";
import { formatCurrency } from "../utils/market";

const TopUp = ({ cards, cancelTopUp }) => {
  const cardList = useMemo(() => Object.values(cards || {}), [cards]);
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    const card = cardList.find((item) => item.cardNum === selectedCard);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Enter a positive funding amount.");
    if (!card) return setError("Select a connected funding card.");
    setPending(true);
    setError("");
    try {
      const updated = await fundWallet(
        localStorage.getItem("userLogged"),
        numericAmount,
        card.cardNum
      );
      if (!updated) throw new Error("wallet-update-failed");
      cancelTopUp();
    } catch {
      setError("Funding could not be completed. Your wallet was not updated.");
      setPending(false);
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="topup-title">
      <form className={styles.modal} onSubmit={submitHandler}>
        <div className={styles.heading}><div><span>Wallet funding</span><h2 id="topup-title">Add USD reserve</h2></div><button type="button" onClick={cancelTopUp}>×</button></div>
        <label><span>Amount</span><div className={styles.amount}><b>$</b><input type="number" min="0" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /><small>USD</small></div></label>
        <label><span>Funding card</span><select value={selectedCard} onChange={(event) => setSelectedCard(event.target.value)}><option value="">Select connected card</option>{cardList.map((card) => <option value={card.cardNum} key={card.cardNum}>•••• {String(card.cardNum).slice(-4)} / {card.expDate}</option>)}</select></label>
        <div className={styles.summary}><span>Wallet will receive</span><strong>{formatCurrency(Number(amount) || 0)}</strong></div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}><button type="button" onClick={cancelTopUp}>Cancel</button><button type="submit" disabled={pending}>{pending ? "Funding…" : "Confirm funding"}</button></div>
      </form>
    </div>
  );
};

export default TopUp;
