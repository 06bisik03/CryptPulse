import styles from "./SentForm.module.css";
import { Link } from "react-router-dom";
const SentForm = () => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <h1>THANK YOU</h1>
        <div className={styles.def}>
          <text>
            Your message has been forwarded to the CryptPulse family. We will
            get back to your as soon as possible!
          </text>
        </div>
        <Link to="/" className={styles.btn}>
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};
export default SentForm;
//this component is responsible for informing the user of the submission of the form.