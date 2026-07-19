import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../UI/Navbar";
import Choice from "./Choice";
import SentForm from "./SentForm";
import styles from "./ContactPage.module.css";

const reasons = [
  { id: "technical", number: "01", title: "Technical issue", body: "Report a product, account, or transaction problem." },
  { id: "feedback", number: "02", title: "Product feedback", body: "Share an idea or suggest an improvement." },
  { id: "general", number: "03", title: "General question", body: "Ask about the platform or your account." },
];

const ContactPage = () => {
  const [reason, setReason] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.page}>
      <Navbar />
      {!reason ? (
        <main className={styles.main}>
          <header className={styles.heading}>
            <span>Member support</span><h1>How can we help?</h1><p>Select the channel that best matches what you need. Your account context stays attached to the request.</p>
          </header>
          <section className={styles.reasons}>
            {reasons.map((item) => <button type="button" onClick={() => setReason(item.id)} key={item.id}><span>{item.number}</span><h2>{item.title}</h2><p>{item.body}</p><i>↗</i></button>)}
            <Link to="/mentoring"><span>04</span><h2>Market intelligence</h2><p>Explore our guided learning and research track.</p><i>↗</i></Link>
          </section>
          <div className={styles.serviceLine}><span><i /> Platform operational</span><span>Typical response / under 24 hours</span></div>
        </main>
      ) : submitted ? (
        <SentForm onReset={() => { setReason(null); setSubmitted(false); }} />
      ) : (
        <Choice mode={reason} onCancel={() => setReason(null)} submitHandler={(event) => { event.preventDefault(); setSubmitted(true); }} />
      )}
    </div>
  );
};

export default ContactPage;
