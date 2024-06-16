import styles from "./Overall.module.css";
import { formatNumber } from "./TableCoin";
const Overall = (props) => {
  console.log(props.data);
  const curPrice = formatNumber(props.data.total_market_cap.usd);
  const change = parseFloat(
    props.data.market_cap_change_percentage_24h_usd
  ).toFixed(4);
  return (
    <div className={styles.container}>
      <div className={styles.overall}>
        <div>Showroom</div>
        <div>
          The tokens that you need to know of today, listed in this very
          showroom. Rankings are calculated based on user data.
        </div>
        <div>The overall crypto market cap for today is ${curPrice} USD.</div>
        <div>Meanwhile the change in per cent is: {change}%.</div>
      </div>
    </div>
  );
};
export default Overall;
//This component is the Overall state of the crypto market. Just like a coin, the whole market also has ups and downs.