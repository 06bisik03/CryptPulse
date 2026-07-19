import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../UI/Navbar";
import ShowRoomElement from "../UI/Exchange/ShowRoomElement";
import Overall from "../UI/Exchange/Overall";
import styles from "./ShowRoom.module.css";
import { fetcherGlobal, fetcherTrending, fetcherGeneral } from "../redux/Api";

const ShowRoom = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.api.generalCoins);
  const trending = useSelector((state) => state.api.trendingCoins);
  const global = useSelector((state) => state.api.globalData?.data);

  useEffect(() => {
    dispatch(fetcherGeneral());
    dispatch(fetcherTrending());
    dispatch(fetcherGlobal());
  }, [dispatch]);

  const groups = useMemo(() => [
    { title: "Market leaders", caption: "Largest networks by market value", coins: [...coins].sort((a, b) => a.market_cap_rank - b.market_cap_rank).slice(0, 5) },
    { title: "Momentum", caption: "Strongest 24-hour price expansion", coins: [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5) },
    { title: "In focus", caption: "Assets drawing market attention", coins: trending.slice(0, 5) },
    { title: "Under pressure", caption: "Weakest 24-hour market structure", coins: [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5) },
  ], [coins, trending]);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Overall data={global} />
        <div className={styles.groups}>
          {groups.map((group, index) => (
            <section className={styles.group} key={group.title}>
              <div className={styles.groupHeader}>
                <span>0{index + 1}</span>
                <div><h2>{group.title}</h2><p>{group.caption}</p></div>
              </div>
              <div className={styles.coinList}>
                {group.coins.map((coin) => <ShowRoomElement coin={coin} key={coin.id} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShowRoom;
