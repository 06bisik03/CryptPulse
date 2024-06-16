import styles from "./TableCoin.module.css";
import { Link } from "react-router-dom";
import CryptoChart from "./CryptoChart";
import LazyLoad from "react-lazy-load";

const TableCoin = (props) => {
  let priceOneDay;
  const price = parseFloat(props.coin.current_price);
  const symbol = props.coin.symbol.toUpperCase();
  const marketCap = formatNumber(props.coin.market_cap);
  //13-25: small change numbers should be fixed to only 5 decimals. more is usually irrelevant. $ should also appear after the + or - sign
  if (Math.abs(props.coin.price_change_24h) < 0.001) {
    priceOneDay = `${
      props.coin.price_change_24h < 0
        ? "-$" + props.coin.price_change_24h.toFixed(5) * -1
        : "+$" + props.coin.price_change_24h.toFixed(5)
    }`;
  } else {
    priceOneDay =
      props.coin.price_change_24h > 0
        ? `+$${parseFloat(props.coin.price_change_24h).toFixed(5)}`
        : `-$${parseFloat(props.coin.price_change_24h).toFixed(5) * -1}`;
  }
  const lastUpdatedDate = new Date(props.coin.last_updated);
  const hours = lastUpdatedDate.getUTCHours().toString().padStart(2, "0");
  const minutes = lastUpdatedDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = lastUpdatedDate.getUTCSeconds().toString().padStart(2, "0");
  const negative =
    props.coin.sparkline_in_7d.price[0] >
    props.coin.sparkline_in_7d.price[
      props.coin.sparkline_in_7d.price.length - 1
    ];

  const image = props.coin.image;

  const priceData = props.coin.sparkline_in_7d.price;
  const priceChangePercentage = parseFloat(
    props.coin.price_change_percentage_24h
  );

  if (Math.abs(priceChangePercentage) < 0.001) {
    priceChangePercentage.toFixed(10);
  } else {
    priceChangePercentage.toPrecision(3);
  }

  return (
    <div className={styles.container}>
      <div>{props.coin.market_cap_rank}</div>
      <div className={styles.nameCoin}>
        <LazyLoad>
          <img src={image} alt="coinimage" />
        </LazyLoad>
        <div className={styles.name}>
          <div>{props.coin.name}</div>
          <div>{symbol}</div>
        </div>
      </div>
      <div>${price}</div>
      <div>{priceChangePercentage}%</div>
      <div>{priceOneDay}</div>
      <div>${marketCap}</div>
      <div>{`${hours}:${minutes}:${seconds}`}</div>
      <div className={styles.graph}>
        <CryptoChart
          data={priceData}
          displacement={negative}
          size={{
            widthS: "1300",
            heightS: "500",
            widthT: "100%",
            heightT: "50",
          }}
        />
      </div>
      <div className={styles.btnContainer}>
        <Link
          className={styles.tradeBtn}
          to={`coin=${props.coin.id}+${props.coin.name}`}
        >
          Trade
        </Link>
      </div>
    </div>
  );
};
export default TableCoin;
//this function formats the number so we do not have numbers with digits like 12 or even more than 15
export function formatNumber(number) {
  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;
  const scaledNumber = number / Math.pow(1000, tier);
  return scaledNumber.toFixed(1) + " " + abbreviations[tier];
}
//This component is responsible for showcasing every Coin that we fetch. It has minimalistic tweaks to show the price in a suitable way.
