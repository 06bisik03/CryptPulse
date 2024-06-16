import Navbar from "../UI/Navbar";
import styles from "./TradeCoin.module.css";
import GridCoin from "../UI/Exchange/GridCoin";
import Converter from "../UI/Exchange/Converter";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import LoadingScreen from "../LoadingScreen";
const TradeCoin = () => {
  const data = useSelector((state) => state.api.generalCoins);
  //we get coin id and name from param that we set up in the component tree
  const { coinID } = useParams();
  const coin = coinID.split("=")[1];
  const [coinid, coinName] = coin.split("+");
  console.log(coinid);
  const cached = JSON.parse(localStorage.getItem("generalCoinsLastCall"));
  console.log(cached);
  const coinData =
    data.length >= 1
      ? data.filter((item) => item.name === coinName)
      : cached.filter((item) => item.name === coinName);
  if (!data) {
    return <LoadingScreen />;
  } else {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.coinDetails}>
          <GridCoin coin={coinData} />
          <Converter coin={coinData} />
        </div>
      </div>
    );
  }
};
export default TradeCoin;
//this component is responsible for showcasing the whole trading page.
