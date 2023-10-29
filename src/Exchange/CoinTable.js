import TableCoin from "../UI/Exchange/TableCoin";
import styles from "./CoinTable.module.css";

import {  useSelector } from "react-redux";


const CoinTable = () => {
  const generalCoins = useSelector((state) => state.api.generalCoins);

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.num}>#</div>
        <div>Name</div>
        <div>
          Current Price
        </div>

        <div>
          24h Fluctuation
        </div>
        <div>
          -24h Price/USD
        </div>
        <div>
          Market Cap
        </div>
        <div>Last Update</div>

        <div>Data Cluster(7d)</div>
      </div>
      <div className={styles.coinListContainer}>
      <div className={styles.coinList}>
        {generalCoins.map((item) => {
          return <TableCoin coin={item} key={item.market_cap_rank} />;
        })}
      </div>
      </div>
      
    </div>
  );
};
export default CoinTable;
//This component is responsible for showing all 50 coins in a table. Every coin has its own component that we outsource to avoid puttin too much logic in an important file