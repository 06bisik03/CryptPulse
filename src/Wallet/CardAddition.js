import { useState } from "react";
import styles from "./CardAddition.module.css";
import { createWalletAndCardsFolders } from "../firebase";

const issuers = ["VISA", "Mastercard", "AmericanExpress", "Square", "Paypal"];

const CardAddition = ({ cancelAddition }) => {
  const [form, setForm] = useState({ cardNum: "", holderName: "", cvc: "", month: "", year: "", bankName: "", type: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    const now = new Date();
    const cardNumber = form.cardNum.replace(/\s/g, "");
    const month = Number(form.month);
    const year = Number(form.year);
    if (!/^\d{16}$/.test(cardNumber)) return setError("Enter a valid 16-digit card number.");
    if (!/^\d{3,4}$/.test(form.cvc)) return setError("Enter a valid security code.");
    if (!form.holderName.trim() || !form.bankName.trim() || !form.type) return setError("Complete every card field.");
    if (month < 1 || month > 12 || year < now.getFullYear() || year > 2050 || (year === now.getFullYear() && month <= now.getMonth() + 1)) return setError("Enter a valid future expiry date.");

    setPending(true);
    try {
      await createWalletAndCardsFolders(localStorage.getItem("userLogged"), {
        cardNum: cardNumber,
        holderName: form.holderName.trim(),
        expDate: `${String(month).padStart(2, "0")}/${year}`,
        bankName: form.bankName.trim(),
        type: form.type,
        introductionDate: Date.now(),
        totalSum: 0,
      });
      cancelAddition();
    } catch {
      setError("The card could not be added. Verify your connection and try again.");
      setPending(false);
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="card-title">
      <form className={styles.modal} onSubmit={submitHandler}>
        <div className={styles.heading}><div><span>Funding method</span><h2 id="card-title">Connect a card</h2></div><button type="button" onClick={cancelAddition} aria-label="Close">×</button></div>
        <div className={styles.preview}>
          <div className={styles.chip} /><span>{form.type || "CRYPTPULSE"}</span>
          <strong>{form.cardNum ? form.cardNum.replace(/(\d{4})(?=\d)/g, "$1 ") : "•••• •••• •••• ••••"}</strong>
          <div><small>Cardholder</small><b>{form.holderName || "YOUR NAME"}</b></div>
          <div><small>Expires</small><b>{form.month || "MM"}/{form.year || "YYYY"}</b></div>
        </div>
        <div className={styles.fields}>
          <label className={styles.full}><span>Card number</span><input inputMode="numeric" maxLength="16" value={form.cardNum} onChange={(event) => update("cardNum", event.target.value.replace(/\D/g, ""))} placeholder="0000000000000000" /></label>
          <label className={styles.full}><span>Cardholder name</span><input value={form.holderName} onChange={(event) => update("holderName", event.target.value)} placeholder="Name as shown on card" /></label>
          <label><span>Expiry month</span><input inputMode="numeric" maxLength="2" value={form.month} onChange={(event) => update("month", event.target.value.replace(/\D/g, ""))} placeholder="MM" /></label>
          <label><span>Expiry year</span><input inputMode="numeric" maxLength="4" value={form.year} onChange={(event) => update("year", event.target.value.replace(/\D/g, ""))} placeholder="YYYY" /></label>
          <label><span>Security code</span><input type="password" inputMode="numeric" maxLength="4" value={form.cvc} onChange={(event) => update("cvc", event.target.value.replace(/\D/g, ""))} placeholder="CVC" /></label>
          <label><span>Bank name</span><input value={form.bankName} onChange={(event) => update("bankName", event.target.value)} placeholder="Issuing bank" /></label>
          <label className={styles.full}><span>Card network</span><select value={form.type} onChange={(event) => update("type", event.target.value)}><option value="">Select network</option>{issuers.map((issuer) => <option value={issuer} key={issuer}>{issuer}</option>)}</select></label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}><button type="button" onClick={cancelAddition}>Cancel</button><button type="submit" disabled={pending}>{pending ? "Connecting…" : "Connect card"}</button></div>
      </form>
    </div>
  );
};

export default CardAddition;
