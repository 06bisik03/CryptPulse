import { useState } from "react";
import styles from "./Coin.module.css";
import SellConfirmation from "./SellConfirmation";
import Purchased from "../Exchange/Purchased";
import SaleError from "./SaleError";
import { formatCurrency, formatPercent, toNumber } from "../../utils/market";

const Coin = ({ coin, currentData }) => {
  const [confirmation, setConfirmation] = useState(false);
  const [successfulSale, setSuccessfulSale] = useState(null);
  const [saleError, setSaleError] = useState(false);
  const currentPrice = toNumber(currentData?.current_price, coin.coinBuyPrice);
  const units = toNumber(coin.coinAmount);
  const cost = toNumber(coin.totalSum);
  const value = units * currentPrice;
  const returnPercentage = cost > 0 ? ((value - cost) / cost) * 100 : 0;
  const negative = returnPercentage < 0;

  const successfulSaleHandler = (sellAmount, gottenAmount) => {
    setConfirmation(false);
    setSuccessfulSale({ sellAmount, coinName: coin.coinName, gottenAmount });
  };

  return (
    <article className={styles.container}>
      {confirmation && currentData && (
        <SellConfirmation dataGeneral={coin} dataCurrent={[currentData]} onCancel={() => setConfirmation(false)} successFullSale={successfulSaleHandler} errorSale={() => { setSaleError(true); setConfirmation(false); }} />
      )}
      {successfulSale && <Purchased sell={successfulSale} onCancel={() => setSuccessfulSale(null)} />}
      {saleError && <SaleError onCancel={() => setSaleError(false)} />}

      <div className={styles.identity}>
        {coin.coinImage ? <img src={coin.coinImage} alt="" /> : <span>{coin.coinSymbol?.slice(0,1)?.toUpperCase() || "?"}</span>}
        <div><strong>{coin.coinName || "Unknown asset"}</strong><small>{coin.coinSymbol?.toUpperCase() || "--"}</small></div>
      </div>
      <div className={styles.metric}><span>Position value</span><strong>{formatCurrency(value)}</strong></div>
      <div className={styles.metric}><span>Units held</span><strong>{units.toLocaleString(undefined, { maximumFractionDigits: 8 })}</strong></div>
      <div className={`${styles.performance} ${negative ? styles.negative : ""}`}><span>Return</span><strong>{formatPercent(returnPercentage)}</strong></div>
      <button type="button" onClick={() => currentData ? setConfirmation(true) : setSaleError(true)}>Sell</button>
    </article>
  );
};

export default Coin;
