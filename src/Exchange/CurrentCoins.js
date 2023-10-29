
import CoinTable from "./CoinTable";
import styles from "./CurrentCoins.module.css";
const CurrentCoins = () => {
  return (
    <div className={styles.container}>
      <h3>Current Coins</h3>
      <CoinTable />
    </div>
  );
};
export default CurrentCoins;
