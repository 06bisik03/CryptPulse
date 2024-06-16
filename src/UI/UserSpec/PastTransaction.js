import LazyLoad from "react-lazy-load";
import styles from "./PastTransaction.module.css";
import { useState, useEffect } from "react";
const PastTransaction = (props) => {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  //7-28: Determine whether the transaction was a purchase or sale and set the type accordingly
  useEffect(() => {
    if (props.transaction.timeOfBuy) {
      const dateS = new Date(props.transaction.timeOfBuy);
      const day = dateS.getDate();
      const month = dateS.toLocaleString("default", {
        month: "short",
      });
      const year = dateS.getFullYear();

      setDate(`${day} ${month} ${year}`);
      setType("Purchase");
    } else {
      const dateS = new Date(props.transaction.timeOfSell);
      const day = dateS.getDate();
      const month = dateS.toLocaleString("default", {
        month: "short",
      });
      const year = dateS.getFullYear();
      setDate(`${day} ${month} ${year}`);
      setType("Sale");
    }
  }, [props.transaction.timeOfBuy, props.transaction.timeOfSell]);

  const symbol = props.transaction.coinSymbol.toUpperCase();
  const price = parseFloat(props.transaction.totalSum).toFixed(2);
  const units = parseFloat(props.transaction.coinAmount).toFixed(7);

  return (
    <div className={styles.container}>
      <div className={styles.date}>{date}</div>
      <div>
        <LazyLoad>
          <img alt="x" src={props.transaction.coinImage} />
        </LazyLoad>
      </div>

      <div className={styles.coinType}>
        {props.transaction.coinName} ({symbol})
      </div>
      <div className={styles.coinAmount}>
        Units:{type === "Sale" ? " -" : " +"} {units} {symbol}/s
      </div>
      <div className={styles.trsAmount}>Total Sum: ${price}</div>
    </div>
  );
};
export default PastTransaction;

//This component is responsible for showing one transaction inside the parent container back in UserProfile.js
