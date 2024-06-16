import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ElementFilter from "../UI/Exchange/ElementFilter";
import styles from "./FilterElements.module.css";

const FilterElements = (props) => {
  const trendingCoins = useSelector((state) => state.api.trendingCoins);
  const generalCoins = useSelector((state) => state.api.generalCoins);

  // Create a ref to access the container
  const containerRef = useRef(null);

  const [filteredCoins, setFilteredCoins] = useState(generalCoins);

  useEffect(() => {
    const filterTheArray = () => {
      let filter;
      switch (props.filter) {
        case "toplosers":
          filter = [...generalCoins]
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .filter((item) => item.price_change_percentage_24h < 0);
          setFilteredCoins(filter);
          break;
        case "topgainers":
          filter = [...generalCoins]
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .filter((item) => item.price_change_percentage_24h > 0);
          setFilteredCoins(filter);
          break;
        default:
          // Handle trending coins
          const firstArrayHash = trendingCoins.reduce((acc, item) => {
            acc[item.name] = true;
            return acc;
          }, {});
          const trendingCoinArray = generalCoins.filter(
            (item) => firstArrayHash[item.name]
          );
          setFilteredCoins(trendingCoinArray);
      }
    };

    if (trendingCoins) {
      filterTheArray();
    }
  }, [props.filter, trendingCoins, generalCoins]);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (containerRef.current) {
        console.log("Wheel event detected"); // Debug log
        // Prevent default vertical scrolling
        event.preventDefault();
        // Scroll horizontally
        containerRef.current.scrollLeft += event.deltaY;
        console.log(`Scrolled to: ${containerRef.current.scrollLeft}`); // Debug log
      }
    };

    const container = containerRef.current;
    if (container) {
      // Attach the wheel event listener
      container.addEventListener("wheel", handleWheelScroll);
      console.log("Event listener attached"); // Debug log
    }

    return () => {
      if (container) {
        // Clean up the event listener on component unmount
        container.removeEventListener("wheel", handleWheelScroll);
        console.log("Event listener removed"); // Debug log
      }
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.elements}>
        {filteredCoins.map((item) => (
          <ElementFilter coin={item} key={item.market_cap_rank} />
        ))}
      </div>
    </div>
  );
};

export default FilterElements;
