import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../UI/Navbar";
import CurrentCoins from "./CurrentCoins";
import styles from "./Exchange.module.css";
import HeaderCoins from "./HeaderCoins";
import { fetcherGeneral, fetcherTrending, fetcherGlobal } from "../redux/Api";
import FetchDataInterval from "../hooks/FetchDataInterval";

const Exchange = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetcherGeneral());
    dispatch(fetcherTrending());
    dispatch(fetcherGlobal());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Navbar />
      <FetchDataInterval />
      <main className={styles.main}>
        <HeaderCoins />
        <CurrentCoins />
      </main>
    </div>
  );
};

export default Exchange;
