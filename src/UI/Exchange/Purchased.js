import { useEffect, useState } from "react";
import styles from "./Purchased.module.css";
import { Link } from "react-router-dom";

const Purchased = (props) => {
  const [sell, setSell] = useState(false);
  //check if the component is used for purchasing or selling (it is used for both to prevent creating more files and repeating code)
  useEffect(() => {
    if (props.sell) {
      setSell(true);
    }
  }, [props.sell]);
  
  return (
    <div className={styles.test}>
      <div className={styles.container}>
        <div className={styles.transaction}>
          <div className={styles.icon}>
            <i className="fa-regular fa-circle-check"></i>
          </div>
          <div>
            <div className={styles.crypt}>
              {sell
                ? `${props.sell.sellAmount} ${props.sell.coinName}`
                : `${props.amountOfCrypto} ${props.typeOfCrypto}`}
            </div>
            <div>{sell ? "Successfully sold" : "Successfully purchased!"}</div>
            {/*The link navigates to exchange if purchase was made or only close the modal otherwise */}
            <Link className={styles.btn} to={!sell && '/exchange'} onClick={() => sell && props.onCancel()}>
              Continue
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Purchased;
//this component is responsible for showing the modal of successful purchases or sales
