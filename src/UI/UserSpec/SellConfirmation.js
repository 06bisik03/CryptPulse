import styles from "./SellConfirmation.module.css";
import btnStyles from "../../UI/Exchange/Purchased.module.css";
import { useState } from "react";
import { sellCoin, updateMoney } from "../../firebase";
import LazyLoad from "react-lazy-load";

const SellConfirmation = (props) => {
  const [sellAmount, setSellAmount] = useState("");
  const [gottenAmount, setGottenAmount] = useState("");

  const cryptoGiven = (e) => {
    setSellAmount(e.target.value);
    const potentialSum =
      parseFloat(e.target.value) * props.dataCurrent[0].current_price;
    setGottenAmount(potentialSum);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const time = new Date();
    const currentTime = time.getTime();
    //make an object to pass as a sale transaction
    const transactionDetails = {
      userLogged: localStorage.getItem("userLogged"),
      coinName: props.dataGeneral.coinName,
      coinAmount: sellAmount,
      coinID: props.dataCurrent[0].id,
      totalSum: gottenAmount,
      coinImage: props.dataCurrent[0].image,
      timeOfSell: currentTime,
      coinSymbol: props.dataCurrent[0].symbol,
    };
    const sellCoinRes = await sellCoin(transactionDetails);
    //if response from firebase.js is truthy, update Money in wallet and show the success modal. Money stays unchanged and error modals shows otherwise
    if (sellCoinRes) {
      try {
        const updated = await updateMoney(
          localStorage.getItem("userLogged"),
          "plus",
          gottenAmount
        );

        if (updated) {
          props.successFullSale(parseFloat(sellAmount), gottenAmount);
        } else {
          props.errorSale();
        }
      } catch {
        console.log("Error updating money after deleting coin.");
        props.errorSale();
      }
    }
  };

  return (
    <div className={styles.backdrop}>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.img}>
          <LazyLoad>
            <img src={props.dataGeneral.coinImage} alt="x" />
          </LazyLoad>
        </div>
        <div className={styles.figures}>
          <div>
            How much from your {props.dataGeneral.coinName} stock would you like
            to sell?
          </div>
          <div>
            <input
              type="number"
              min="0"
              max={props.dataGeneral.coinAmount}
              placeholder="0"
              step="any"
              onChange={cryptoGiven}
              value={sellAmount}
            />
            <input type="number" value={gottenAmount} />
          </div>

          <div>
            <button className={btnStyles.btn} onClick={() => props.onCancel()}>
              Cancel
            </button>
            <button className={btnStyles.btn} type="submit">
              Sell
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SellConfirmation;
//This component is responsible for asking the user the amount of coins he wants to sell.
