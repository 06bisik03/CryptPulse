import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>CryptPulse</div>
      <div className={styles.nav}>
        <Link to="/profile" className={styles.button}>
          Profile
        </Link>
        <Link to="/wallet" className={styles.button}>
          Wallet
        </Link>
        <Link to="/exchange" className={styles.button}>
          Exchange
        </Link>
        <Link to="/contact" className={styles.button}>
          Contact
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
