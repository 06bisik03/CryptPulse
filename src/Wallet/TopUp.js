import styles from "./TopUp.module.css";
import btnStyles from "./CardAddition.module.css";
import { useRef } from "react";
import { useState } from "react";
import { ChargeOnCard } from "../firebase";
import { updateMoney } from "../firebase";
const TopUp = (props) => {
  const priceRef = useRef();
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  //Store all cards of the user in an array
  const cardArray = Object.values(props.cards);

  const submitHandler = async (event) => {
    //When submitted, we store the selected card that will be charged in a variable
    event.preventDefault();
    const amount = parseFloat(priceRef.current.value);
    const selectedCard = cardArray[selectedCardIndex];
    //if the selection has taken place, charge card, increase money
    if (selectedCardIndex !== -1) {
      await ChargeOnCard(
        // Use the imported function
        localStorage.getItem("userLogged"),
        amount,
        selectedCard.cardNum
      );
      updateMoney(localStorage.getItem("userLogged"), "plus", amount);
    }
    props.cancelTopUp();
  };
  //Card selection: 
  const handleCardSelection = (event) => {
    //use index to get selected card out of stored card array
    const selectedIndex = event.target.value;
    setSelectedCardIndex(selectedIndex);
  };


  return (
    <div className={styles.container}>
      <form className={styles.topUp} onSubmit={submitHandler}>
        <div>Top Up Account</div>
        <div className={styles.amount}>
          <input placeholder="Amount of TopUp" ref={priceRef} />
        </div>
        <div className={styles.card}>
          <select
            value={selectedCardIndex}
            onChange={handleCardSelection}
            className={styles.select}>
            <option value={-1} disabled>
              Please select an introduced card
            </option>
            {cardArray.map((item, index) => (
              <option key={index} value={index} className={styles.option}>
                {"Number: "}
                {item.cardNum}
                {" with expiry date: "}
                {item.expDate}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.btnHolder}>
          <button className={btnStyles.btn} onClick={() => props.cancelTopUp()}>
            Cancel
          </button>
          <button className={btnStyles.btn} type="submit">
            Top Up
          </button>
        </div>
      </form>
    </div>
  );
};
export default TopUp;
//This component is responsible for topping the account money up and charging the card chosen for the top up.