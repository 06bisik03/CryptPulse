import CoinTable from "./CoinTable";
import styles from "./CurrentCoins.module.css";

const CurrentCoins = () => (
  <section className={styles.container}>
    <CoinTable />
  </section>
);

export default CurrentCoins;
