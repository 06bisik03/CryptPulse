import styles from "./SaleError.module.css";

const SaleError = ({ onCancel }) => (
  <div className={styles.backdrop} role="alertdialog" aria-modal="true">
    <div className={styles.modal}><span>!</span><h2>Order not completed</h2><p>The sale could not be executed. Your position and wallet balance were not changed.</p><button type="button" onClick={onCancel}>Close</button></div>
  </div>
);

export default SaleError;
