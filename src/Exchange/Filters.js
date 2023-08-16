import styles from "./Filters.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
const Filters = (props) => {
  const clickHandler = (e) => {
    props.setFilter(e);
  };
  //keep the filter mode in a variable
  const [active, setActive] = useState("topCoins");
  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        style={{
          transform: active === "topCoins" ? "scale(1.25)" : "none",
          marginLeft: active === "topCoins" ? '14px' : '0px',
        }}
        onClick={() => {
          clickHandler("topcoins");
          setActive("topCoins");
        }}>
        Top Coins(7d)
      </button>
      <button
        className={styles.btn}
        style={{
          transform: active === "topGainers" ? "scale(1.25)" : "none",
        }}
        onClick={() => {
          clickHandler("topgainers");
          setActive("topGainers");
        }}>
        Top Gainer(7d)
      </button>

      <button
        className={styles.btn}
        style={{
          transform: active === "topLosers" ? "scale(1.25)" : "none",
        }}
        onClick={() => {
          clickHandler("toplosers");
          setActive("topLosers");
        }}>
        Top Losers(7d)
      </button>

      <Link to="/exchange/showroom" className={`${styles.btn} ${styles.link}`}>
        Sample Room
      </Link>
    </div>
  );
};
export default Filters;
//In this component the filter modes are showcased and the click event which activates each filter mode is written
