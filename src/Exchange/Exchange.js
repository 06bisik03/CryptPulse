import Navbar from "../UI/Navbar";
import CurrentCoins from "./CurrentCoins";
import styles from "./Exchange.module.css";
import { useEffect, useState } from "react";
import HeaderCoins from "./HeaderCoins";

import { useDispatch, useSelector } from "react-redux";
import { fetcherGeneral, fetcherTrending, fetcherGlobal } from "../redux/Api";
import FetchDataInterval from "../hooks/FetchDataInterval";
import LoadingScreen from "../LoadingScreen";

const Exchange = () => {

  const generalCoins = useSelector((state) => state.api.generalCoins);
  const trendingCoins = useSelector((state) => state.api.trendingCoins);
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();
//fetch data by dispatch to trigger the actions
  useEffect(() => {
    setLoading(true); // Start loading
    dispatch(fetcherGeneral());
    dispatch(fetcherTrending());
    dispatch(fetcherGlobal());
  }, [dispatch]); 
  //if general/trending coins are loaded, page is ready to render = set loading to false
  useEffect(() => {
    if (generalCoins.length > 0 && trendingCoins.length > 0) {
      setLoading(false); // Data loading complete
    }
  }, [generalCoins, trendingCoins]);


  //only render the page if it is done loading
  if (loading) {
    return <LoadingScreen />;
  } else {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.details}>
          <FetchDataInterval />
          <HeaderCoins />
          <CurrentCoins />
        </div>
      </div>
    );
  }
};

export default Exchange;
/* use other components to showcase things that do not correlate too much with each other to not have too much content in main files */