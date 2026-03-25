import styles from "./TableCoin.module.css";
import { Link } from "react-router-dom";
import CryptoChart from "./CryptoChart";
import LazyLoad from "react-lazy-load";

const getNumber = (value) =>
  typeof value === "number" ? value : Number.parseFloat(value);

const formatCurrencyChange = (value) => {
  const numericValue = getNumber(value);

  if (!Number.isFinite(numericValue) || numericValue === 0) {
    return "$0.00000";
  }

  const absoluteValue = Math.abs(numericValue);
  const prefix = numericValue > 0 ? "+$" : "-$";

  return `${prefix}${absoluteValue.toFixed(5)}`;
};

const formatPercentageChange = (value) => {
  const numericValue = getNumber(value);

  if (!Number.isFinite(numericValue)) {
    return "N/A";
  }

  const precision = Math.abs(numericValue) < 0.001 ? 10 : 3;
  return numericValue.toFixed(precision);
};

const TableCoin = (props) => {
  const price = getNumber(props.coin.current_price);
  const symbol = props.coin.symbol?.toUpperCase() ?? "";
  const marketCap = formatNumber(props.coin.market_cap);
  const priceOneDay = formatCurrencyChange(props.coin.price_change_24h);
  const lastUpdatedDate = new Date(props.coin.last_updated);
  const hasValidDate = !Number.isNaN(lastUpdatedDate.getTime());
  const hours = hasValidDate
    ? lastUpdatedDate.getUTCHours().toString().padStart(2, "0")
    : "--";
  const minutes = hasValidDate
    ? lastUpdatedDate.getUTCMinutes().toString().padStart(2, "0")
    : "--";
  const seconds = hasValidDate
    ? lastUpdatedDate.getUTCSeconds().toString().padStart(2, "0")
    : "--";
  const priceData = Array.isArray(props.coin.sparkline_in_7d?.price)
    ? props.coin.sparkline_in_7d.price.filter((item) => Number.isFinite(item))
    : [];
  const negative =
    priceData.length > 1 ? priceData[0] > priceData[priceData.length - 1] : false;

  const image = props.coin.image;
  const priceChangePercentage = formatPercentageChange(
    props.coin.price_change_percentage_24h
  );

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
      <div>{Number.isFinite(price) ? `$${price}` : "N/A"}</div>
      <div>
        {priceChangePercentage === "N/A"
          ? priceChangePercentage
          : `${priceChangePercentage}%`}
      </div>
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
  const numericValue = getNumber(number);

  if (!Number.isFinite(numericValue) || numericValue === 0) {
    return "0.0";
  }

  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(numericValue)) / 3) | 0;
  const scaledNumber = numericValue / Math.pow(1000, tier);
  return scaledNumber.toFixed(1) + " " + abbreviations[tier];
}
//This component is responsible for showcasing every Coin that we fetch. It has minimalistic tweaks to show the price in a suitable way.
