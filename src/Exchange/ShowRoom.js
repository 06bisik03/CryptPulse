import styles from "./ShowRoom.module.css";
import Navbar from "../UI/Navbar";
import ShowRoomElement from "../UI/Exchange/ShowRoomElement";
import Overall from "../UI/Exchange/Overall";
import { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetcherGlobal, fetcherTrending, fetcherGeneral } from "../redux/Api";
import LoadingScreen from "../LoadingScreen";
import imgBack from '../Assets/contact.jpg';
const ShowRoom = (props) => {
  const dispatch = useDispatch();
  const dataGeneral = useSelector((state) => state.api.generalCoins);
  const dataTrending = useSelector((state) => state.api.trendingCoins);
  const dataGlobal = useSelector((state) => state.api.globalData);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (dataGeneral.length === 0) {
      dispatch(fetcherGeneral(undefined, { reducerPath: "coins" }));
    }
    if (dataTrending.length === 0) {
      dispatch(fetcherTrending(undefined, { reducerPath: "transactions" }));
    }
    if (dataGlobal.length === 0) {
      dispatch(fetcherGlobal(undefined, { reducerPath: "api" }));
    }
    const img = new Image();
    img.src = imgBack; 
    img.onload = () => setIsImageLoaded(true);
    console.log(img.src, isImageLoaded);
  }, [dispatch, dataGeneral, dataGlobal, dataTrending]);

  const losersSlice = dataGeneral.slice();
  const gainersSlice = dataGeneral.slice();
  const globalData = dataGlobal.data;
  const topCoins = dataGeneral.slice(0, 5);
  const trending = dataTrending.slice(0, 5);
  const toplosers = losersSlice
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 5);
  const topgainers = gainersSlice
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 5);

  if (!topCoins || !globalData || !toplosers || !trending || !isImageLoaded) {
    return <LoadingScreen />;
  } else {
    return (
      <div className={styles.container} 
      style={{ backgroundImage: `url(${imgBack})` }}>
        <Navbar />
        <Overall data={globalData} />
        <div className={styles.showGroups}>
          <div className={styles.leftGroup}>
            <div className={styles.groupCase}>
              <>TOP COINS</>
              <div className={styles.coinShow}>
                {topCoins.map((item) => {
                  return <ShowRoomElement coin={item} key={item.cap_rank} />;
                })}
              </div>
            </div>
            <div className={styles.groupCase}>
              <>TOP GAINERS</>
              <div className={styles.coinShow}>
                {topgainers.map((item) => {
                  return <ShowRoomElement coin={item} key={item.cap_rank} />;
                })}
              </div>
            </div>
          </div>
          <div className={styles.leftGroup}>
            <div className={styles.groupCase}>
              <>TRENDING COINS</>
              <div className={styles.coinShow}>
                {trending.map((item) => {
                  return <ShowRoomElement coin={item} />;
                })}
              </div>
            </div>
            <div className={styles.groupCase}>
              <>TOP LOSERS</>
              <div className={styles.coinShow}>
                {toplosers.map((item) => {
                  return <ShowRoomElement coin={item} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default ShowRoom;
// this component is responsible for showing the user all the filters on the top of the exchange page at once.