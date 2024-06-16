import styles from "./ElementFilter.module.css";
import CryptoChart from "./CryptoChart";
import LazyLoad from "react-lazy-load";
const ElementFilter = (props) => {
  const image = props.coin.image;
  const price = props.coin.current_price;
  const name = props.coin.name;
  const displacement = parseFloat(props.coin.price_change_percentage_24h);
  const graphData = props.coin.sparkline_in_7d.price;
  const negative =
    props.coin.sparkline_in_7d.price[0] >
    props.coin.sparkline_in_7d.price[
      props.coin.sparkline_in_7d.price.length - 1
    ];
  return (
    <div className={styles.container}>
      <div className={styles.imgGraph}>
        <LazyLoad>
          <img src={image} alt="cyrptoImg" />
        </LazyLoad>

        <div className={styles.graph}>
          <CryptoChart
            data={graphData}
            displacement={negative}
            size={{
              widthS: "800",
              heightS: "200",
              widthT: "100%",
              heightT: "100%",
            }}
          />
        </div>
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.prices}>
        <div className={styles.curr}>${price}</div>
        <div className={styles.displacement}>{displacement}%</div>
      </div>
    </div>
  );
};
export default ElementFilter;
//This component is responsible for displaying the coin as a whole on the page after it has gone through the sorting logic.
