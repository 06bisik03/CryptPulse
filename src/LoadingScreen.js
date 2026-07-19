import styles from "./LoadingScreen.module.css";

const LoadingScreen = ({ label = "Synchronizing market" }) => (
  <div className={styles.container} role="status" aria-live="polite">
    <div className={styles.loader} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default LoadingScreen;
