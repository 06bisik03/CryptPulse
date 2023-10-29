import ElementFilter from "../UI/Exchange/ElementFilter";
import styles from "./FilterElements.module.css";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const FilterElements = (props) => {
  const trendingCoins = useSelector((state) => state.api.trendingCoins);
  const generalCoins = useSelector((state) => state.api.generalCoins);
  // 9-16: generalCoins array has graph values for the coins when trendingCoins does not. We take out the matching coins in generalCoins, so that we have access to the graph data of the trending coins.
  const firstArrayHash = trendingCoins.reduce((acc, item) => {
    acc[item.name] = true;
    return acc;
  }, {});
  const trendingCoinArray = generalCoins.filter(
    (item) => firstArrayHash[item.name]
  );

  const [filteredCoins, setFilteredCoins] = useState(generalCoins);

  useEffect(() => {
    const filterTheArray = () => {
      let filter;
      switch (props.filter) {
        case "toplosers":
          const coinsCopy = generalCoins.slice();
          filter = coinsCopy
            .sort(
              (a, b) =>
                a.price_change_percentage_24h - b.price_change_percentage_24h
            )
            .filter((item) => item.price_change_percentage_24h < 0);
          setFilteredCoins(filter);

          break;
        case "topgainers":
          const coinsCopy2 = generalCoins.slice();
          filter = coinsCopy2
            .sort(
              (a, b) =>
                b.price_change_percentage_24h - a.price_change_percentage_24h
            )
            .filter((item) => item.price_change_percentage_24h > 0);
          setFilteredCoins(filter);

          break;

        default:
          setFilteredCoins(trendingCoinArray);
      }
    };
    //execute the filter system only if trendingCoins are present 
    if (trendingCoins) {
      filterTheArray();
    }
  }, [props.filter, trendingCoins,generalCoins,trendingCoinArray]);

  return (
    <div className={styles.container}>
      <div className={styles.elements}>
        {filteredCoins.map((item) => {
          
            return item && <ElementFilter coin={item} key={item.market_cap_rank} />;
          
        })}
      </div>
    </div>
  );
};

export default FilterElements;
//This component is responsible for the sorting of the coins that are available to the user after fetching them.