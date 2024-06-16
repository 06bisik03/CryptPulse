import styles from "./Coin.module.css";
import useCoinFormula from "../../hooks/useCoinFormula";
import { useEffect, useState } from "react";
import SellConfirmation from "./SellConfirmation";
import Purchased from "../Exchange/Purchased";
import SaleError from "./SaleError";
import LazyLoad from "react-lazy-load";
const Coin = (props) => {
  const coinData = useCoinFormula(props.coin, props.currentData);
  const [confirmation, setConfirmation] = useState(false);
  const [unitTooBig, setUnitTooBig] = useState(false);
  const [successfulSale, setSuccessfulSale] = useState(null);
  const [saleInfo, setSaleInfo] = useState(null);
  const [saleError, setSaleError] = useState(false);
  //if the unit is too big set the variable accordingly, to change the font size in jsx later
  useEffect(() => {
    setUnitTooBig(String(coinData.coinAmount).length > 15);
  }, [coinData.coinAmount]);
  //19-29: Managing the states of the modals
  const errorSaleHandler = () => {
    setSaleError(true);
    setSuccessfulSale(false);
    setConfirmation(false);
  };
  const successfulSaleHandler = (sellAmount, gottenAmount) => {
    setConfirmation(false);
    setSuccessfulSale(true);
    setConfirmation(false);
    setSaleInfo({ sellAmount, coinName: props.coin.coinName, gottenAmount });
  };
  //31-40: Finding out how many decimal points a price has, to be able to manipulate how it shows up in the card
  const [pr, decimalsCurPrice] = coinData.currentPrice.toString().split(".");
  console.log(pr);
  const decimalCountCurPrice = decimalsCurPrice ? decimalsCurPrice.length : 0;
  const curPriceFormatted =
    decimalCountCurPrice > 5
      ? coinData.currentPrice.toFixed(6)
      : coinData.currentPrice.toFixed(1);
  const investedFormatted =
    decimalCountCurPrice > 5
      ? coinData.totalSumBought.toFixed(6)
      : coinData.totalSumBought.toFixed(1);
  if (coinData) {
    return (
      <div className={styles.container}>
        {confirmation && (
          <SellConfirmation
            dataGeneral={props.coin}
            dataCurrent={props.currentData}
            onCancel={() => setConfirmation(false)}
            successFullSale={successfulSaleHandler}
            errorSale={errorSaleHandler}
          />
        )}
        {successfulSale && (
          <Purchased sell={saleInfo} onCancel={() => setSuccessfulSale(null)} />
        )}
        {saleError && <SaleError onCancel={() => setSaleError(null)} />}

        <div className={styles.image}>
          <LazyLoad>
            <img src={coinData.coinImage} alt="x" />
          </LazyLoad>
        </div>
        <div className={styles.details}>
          <div className={styles.name}>
            {coinData.coinName}
            <i
              className="fa-solid fa-square-minus"
              onClick={() => setConfirmation(true)}
            ></i>
          </div>
          <div className={styles.figures}>
            <div className={styles.actualPrices}>
              <div className={styles.currentPrice}>
                <div className={styles.title}>Current Price:</div>
                <div className={styles.figure}>$ {curPriceFormatted}</div>
              </div>
              <div className={styles.buyPoint}>
                <div className={styles.title}>Money In:</div>
                <div className={styles.figure}>$ {investedFormatted}</div>
              </div>
            </div>
            <div className={styles.profitMargin}>
              {coinData.differenceOldVSNew + "%"}
              {coinData.differenceOldVSNew === 0 ? (
                <i
                  class="fa-solid fa-equals fa-beat"
                  style={{ color: "#005eff" }}
                ></i>
              ) : coinData.differenceOldVSNew < 0 ? (
                <i
                  class="fa-solid fa-arrow-down fa-beat"
                  style={{ color: "#ff0000" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-arrow-up fa-beat"
                  style={{ color: "#27b300" }}
                ></i>
              )}
            </div>
          </div>
          <div className={styles.lastUpdate}>
            <div className={styles.title}>Units:</div>{" "}
            <div
              className={styles.figure}
              style={{ fontSize: unitTooBig ? "12px" : "20px" }}
            >
              {coinData.coinAmount}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading Coin</div>;
  }
};
export default Coin;
//this component is responsible for showing one coin out of the coins array, that contains all coins that the user has bought until now.
//This component also contains a button to sell any desired amount of the stock that user owns. It has 2 different components that show up according to the state of the sale. Success and Failure
