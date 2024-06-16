import {  useState } from "react";
import { buyCoin } from "../../firebase";

import styles from "./Confirmation.module.css";
import Purchased from "./Purchased";
import InsufficientFunds from "./InsufficientFunds";

const Confirmation = (props) => {
  const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);

  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);

  const handleCoinPurchase = async () => {

    const time = new Date();
    const currentTime = time.getTime();
    //create a variable for purchase transaction
    const transactionDetails = {
      userLogged: localStorage.getItem("userLogged"),
      coinID: props.data.coin.id,
      coinAmount: props.data.formData.coinAmount,
      coinBuyPrice: props.data.coin.current_price,
      coinSymbol: props.data.coin.symbol,
      coinName: props.data.coin.name,
      totalSum: props.data.formData.price,
      coinImage: props.data.coin.image,
      coinLastUpdate: props.data.coin.last_updated,
      timeOfBuy: currentTime,
    };
    //make use of buyCoin declared in firebase.js
    const funds = await buyCoin(transactionDetails);
    //if funds will be true, then user has enough money = transaction successful
    if (funds) {
      setPurchaseSuccessful(true);
    } else {
      setShowInsufficientFunds(true);
    }
  };
  return (
    <div className={styles.backdrop}>
      {purchaseSuccessful && (
        <Purchased
          amountOfCrypto={props.data.formData.coinAmount}
          typeOfCrypto={props.data.coin.symbol}
        />
      )}
      {showInsufficientFunds && (
        <InsufficientFunds onCancel={() => setShowInsufficientFunds(false)} />
      )}{" "}
      (
      <div className={styles.container}>
        <div>
          <h2>Purchase Confirmation</h2>
        </div>
        <div>
          Are you sure you would like to buy {props.data.formData.coinAmount}{" "}
          {props.data.coin.name}/s for ${props.data.formData.price}?
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              props.onCancel();
            }}>
            Cancel
          </button>
          <button onClick={handleCoinPurchase}>Confirm</button>
        </div>
      </div>
      )
    </div>
  );
};

export default Confirmation;
//this component is responsible for evaluating whether the transaction is valid or not.It alerts the user whether they are sure of this transaction. It shows an appropriate modal according to its validity.