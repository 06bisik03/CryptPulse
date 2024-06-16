import Filters from "./Filters";
import FilterElements from "./FilterElements";
import styles from "./HeaderCoins.module.css";
import { useState } from "react";
const HeaderCoins = () => {
  
  const [filterMode, setFilterMode] = useState("");
  return (
    <div className={styles.container}>

      <Filters setFilter={(e) => setFilterMode(e)} />
      <FilterElements
        filter={filterMode === "" ? "topcoins" : filterMode}
      />
    </div>
  );
};
export default HeaderCoins;
// This component sets the filter modes that is present on top of the page in the exchange tab. If none is chosen then it is default to Top Coins
