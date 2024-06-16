import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetcherGeneral,fetcherGlobal,fetcherTrending } from "../redux/Api";

const FetchDataInterval = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch data immediately
    dispatch(fetcherGeneral());
    dispatch(fetcherTrending());
    dispatch(fetcherGlobal());

    // Fetch data every 60 seconds
    const interval = setInterval(() => {
      console.log('xx')
      dispatch(fetcherGeneral());
      dispatch(fetcherGlobal());
    }, 60000);

    // Fetch data every 600 seconds (10 minutes)
    const trendingInterval = setInterval(() => {
      dispatch(fetcherTrending());
      console.log('xx')
    }, 600000);

    // Clean up intervals when the component unmounts
    return () => {
      clearInterval(interval);
      clearInterval(trendingInterval);
    };
  }, [dispatch]);
  
  return null;
};

export default FetchDataInterval;
