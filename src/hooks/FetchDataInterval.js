import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetcherGeneral, fetcherGlobal, fetcherTrending } from "../redux/Api";

const FetchDataInterval = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshMarket = () => {
      if (document.visibilityState === "visible") {
        dispatch(fetcherGeneral());
        dispatch(fetcherGlobal());
      }
    };
    const refreshTrending = () => {
      if (document.visibilityState === "visible") dispatch(fetcherTrending());
    };

    const interval = setInterval(refreshMarket, 120000);
    const trendingInterval = setInterval(refreshTrending, 600000);

    // Clean up intervals when the component unmounts
    return () => {
      clearInterval(interval);
      clearInterval(trendingInterval);
    };
  }, [dispatch]);

  return null;
};

export default FetchDataInterval;
