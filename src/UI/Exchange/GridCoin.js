import styles from "./GridCoin.module.css";
import { useEffect } from "react";
import { countZerosAfterDecimal } from "../../Store/NumberFormatters";
import { useParams } from "react-router";
import GraphDetail from "../../Store/GraphDetail";
import React from "react";
import { NumberFormatter3 } from "../../Store/NumberFormatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import LoadingScreen from "../../LoadingScreen";
import LazyLoad from "react-lazy-load";
const GridCoin = (props) => {
  const store = GraphDetail();
  const params = useParams();
  const coinId = params.coinID.split("+")[0].split("=")[1];
  useEffect(() => {
    store.fetchData(coinId);
  }, [coinId, store]);
  if (!props.coin[0]) {
    return <LoadingScreen />;
  } else {
    let ydomain;
    const change = props.coin[0].price_change_24h;
    const changeNr = parseFloat(change).toFixed(5);
    const percentageChange = props.coin[0].price_change_percentage_24h;
    const priceChange = changeNr > 0 ? `+$${changeNr}` : `-$${changeNr * -1}`;
    const wantedPercentage = parseFloat(percentageChange).toFixed(3);
    if (props.coin[0].current_price < 0.001) {
      const digits = countZerosAfterDecimal(props.coin[0].current_price);
      const lowerLimit = parseFloat("0." + "0".repeat(digits + 1));
      const upperLimit = parseFloat("0." + "0".repeat(digits - 2) + "1");

      ydomain = [lowerLimit, upperLimit];
    } else {
      ydomain = ["dataMin", "dataMax"];
    }

    const marketCapChange = NumberFormatter3(
      props.coin[0].market_cap_change_percentage_24h
    );
    const marketCapFormatted = NumberFormatter3(props.coin[0].market_cap);

    const formatPrice = (price) => {
      const priceFormatted = parseFloat(price).toFixed(7);
      return `$${priceFormatted}`;
    };

    return (
      <div className={styles.container}>
        <div className={styles.gridCoin}>
          <div className={styles.details}>
            <div className={styles.detailsInfo}>
              <div className={styles.titlePriceContainer}>
                <div className={styles.title}>
                  <h2>{props.coin[0].name}</h2>
                </div>
                <div className={styles.prices}>
                  <div className={styles.figures}>
                    <div>${props.coin[0].current_price}</div>
                    <div
                      className={
                        change > 0 ? styles.priceUpped : styles.priceDowned
                      }
                    >
                      {priceChange}
                    </div>
                  </div>
                  <div
                    className={`${styles.disp} ${
                      change > 0 ? styles.priceUpped : styles.priceDowned
                    }`}
                  >
                    {wantedPercentage}% (24h)
                  </div>
                </div>
              </div>
              <div className={styles.coinImage}>
                <LazyLoad>
                  <img alt="coinimage" src={props.coin[0].image} />
                </LazyLoad>
              </div>
            </div>
            <div className={styles.graph}>
              <LineChart
                width={850}
                height={400}
                data={store.graphData}
                margin={{
                  top: 25,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="1 7" />
                <XAxis
                  dataKey="time"
                  stroke="black"
                  tick={{ fontSize: 12 }}
                  tickCount={store.graphData.length / 60}
                />
                <YAxis
                  domain={ydomain}
                  tickFormatter={formatPrice}
                  stroke="black"
                  tick={{ fontSize: 12 }}
                  interval="preserveEnd"
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "black" }}>{value}</span>
                  )}
                  align="center"
                />
                <Line
                  type="basis"
                  dataKey="price"
                  name={`Price of ${props.coin[0].name}`}
                  stroke={percentageChange > 0 ? "green" : "red"}
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="cubic-bezier(0.645, 0.045, 0.355, 1)"
                />
              </LineChart>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoCont}>
              <div>Total Market Cap</div>
              <div>${marketCapFormatted}</div>
            </div>
            <div className={styles.infoCont}>
              <div>Market Change(24h)</div>
              <div>{marketCapChange}%</div>
            </div>
            <div className={styles.infoCont}>
              <div>24h High</div>
              <div>${props.coin[0].high_24h}</div>
            </div>
            <div className={styles.infoCont}>
              <div>24h Low</div>
              <div>${props.coin[0].low_24h}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default GridCoin;
//this function is responsible for formatting the numbers just like the formatNumber1 however it is more specific
export function formatNumber2(number) {
  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

  // Check if the number is lower than 0
  if (number < 0) {
    // Calculate the number of zeros after the decimal point
    const zerosCount = Math.max(0, -tier * 3 - 3);
    return (number / Math.pow(10, tier * 3)).toFixed(zerosCount);
  }

  // If the number is greater than or equal to 0
  // Calculate the number of zeros after the decimal point and adjust the tier accordingly
  const zerosCount = Math.max(0, -tier * 3);
  return (
    (number / Math.pow(10, tier * 3)).toFixed(zerosCount) +
    (tier > 0 ? " " + abbreviations[tier] : "")
  );
}

//this component is responsible for showcasing a detailed graph and some important info about the coin
