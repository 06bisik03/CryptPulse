import { Link } from "react-router-dom";
import styles from "./SentForm.module.css";

const SentForm = ({ onReset }) => (
  <main className={styles.main}>
    <div className={styles.icon}>✓</div>
    <span>Request received</span>
    <h1>Your message is with the right team.</h1>
    <p>We have recorded your request. A member of support will respond through your account email.</p>
    <div className={styles.actions}><button type="button" onClick={onReset}>Send another</button><Link to="/exchange">Return to markets <span>→</span></Link></div>
  </main>
);

export default SentForm;
