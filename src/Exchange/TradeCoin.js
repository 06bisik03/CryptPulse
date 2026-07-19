import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Navbar from "../UI/Navbar";
import styles from "./TradeCoin.module.css";
import GridCoin from "../UI/Exchange/GridCoin";
import Converter from "../UI/Exchange/Converter";
import { fetcherGeneral } from "../redux/Api";

const parseCoinParam = (coinID = "") => {
  const cleaned = coinID.startsWith("coin=") ? coinID.slice(5) : coinID;
  const [encodedId, ...nameParts] = cleaned.split("+");
  return {
    id: decodeURIComponent(encodedId || ""),
    name: decodeURIComponent(nameParts.join("+") || ""),
  };
};

const TradeCoin = () => {
  const dispatch = useDispatch();
  const { coinID } = useParams();
  const coins = useSelector((state) => state.api.generalCoins);
  const market = useSelector((state) => state.api);
  const requested = parseCoinParam(coinID);
  const coin = coins.find((item) => item.id === requested.id) ||
    coins.find((item) => item.name.toLowerCase() === requested.name.toLowerCase()) ||
    coins[0];

  useEffect(() => {
    if (market.status === "idle") dispatch(fetcherGeneral());
  }, [dispatch, market.status]);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/exchange">Markets</Link><span>/</span><span>{coin?.symbol?.toUpperCase() || "Asset"}</span>
        </div>
        {coin ? (
          <div className={styles.layout}>
            <GridCoin coin={coin} />
            <Converter coin={coin} />
          </div>
        ) : (
          <div className={styles.missing}>
            <span>Asset unavailable</span>
            <h1>This market could not be resolved.</h1>
            <Link to="/exchange">Return to markets</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default TradeCoin;
