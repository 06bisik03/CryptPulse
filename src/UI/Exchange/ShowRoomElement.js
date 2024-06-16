import LazyLoad from "react-lazy-load";
import styles from "./ShowRoomElement.module.css";
import { Link } from "react-router-dom";
const ShowRoomElement = (props) => {
  return (
    <div className={styles.container}>
      <Link
        to={`/exchange/coin=${props.coin.id}+${props.coin.name}`}
        className={styles.details}
      >
        <div>#{props.coin.market_cap_rank}</div>
        <div className={styles.nameImg}>
          <LazyLoad>
            <img alt="x" src={props.coin.image} />
          </LazyLoad>
          <div>{props.coin.name}</div>
        </div>
        <div className={styles.price}>
          <div>${props.coin.current_price}</div>
          <div>{props.coin.price_change_percentage_24h}% (24h)</div>
        </div>
      </Link>
    </div>
  );
};
export default ShowRoomElement;
//this component is responsible for showcasing one coin passed down to it in the showroom inside a parent component. It links to the trade page of the coin
