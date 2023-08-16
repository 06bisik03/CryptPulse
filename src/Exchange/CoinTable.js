import TableCoin from "../UI/Exchange/TableCoin";
import styles from "./CoinTable.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { coinsActions } from "../redux/Coins";
import { useRouteLoaderData } from "react-router";

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
          Market Cap/USD
        </div>
        <div>Last Update</div>

        <div>Data Cluster(7d)</div>
      </div>
      <div className={styles.coinList}>
        {generalCoins.map((item) => {
          return <TableCoin coin={item} key={item.market_cap_rank} />;
        })}
      </div>
    </div>
  );
};
export default CoinTable;
//This component is responsible for showing all 50 coins in a table. Every coin has its own component that we outsource to avoid puttin too much logic in an important file