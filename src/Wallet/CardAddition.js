import styles from "./CardAddition.module.css";
import { useRef, useState, useEffect } from "react";
import { createWalletAndCardsFolders } from "../firebase";
import LazyLoad from "react-lazy-load";

//ALl options that exists for a card in CryptoPulse are the following:
const optionsArray = [
  { value: "VISA", label: "VISA" },
  { value: "Mastercard", label: "Mastercard" },
  { value: "AmericanExpress", label: "American Express" },
  { value: "Square", label: "Square(VISA)" },
  { value: "Paypal", label: "PayPal(Mastercard)" },
];
const CardAddition = (props) => {
  const [cardNum, setCardNum] = useState("");
  const [monthValid, setMonthValid] = useState(true);

  const [yearValid, setYearValid] = useState(true);
  const [imgSource, setImgSource] = useState("/images/card.png");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  // Update card image source based on card number when it changes. Every Card has its own initial IIN
  useEffect(() => {
    if (cardNum) {
      const imgSource =
        cardNum.charAt(0) === "4"
          ? "/images/VisCard.png"
          : cardNum.slice(0, 2) >= "34" && cardNum.slice(0, 2) <= "37"
          ? "/images/AmeCard.jpeg"
          : cardNum.slice(0, 2) >= "51" && cardNum.slice(0, 2) <= "55"
          ? "/images/MasCard.png"
          : cardNum.slice(0, 5) >= "2221" && cardNum.slice(0, 5) <= "2720"
          ? "/images/MasCard.png"
          : "/images/card.png";
      setImgSource(imgSource);
    } else {
      setImgSource("/images/card.png");
    }
  }, [cardNum]);

  const formRefs = {
    cardNum: useRef(),
    name: useRef(),
    month: useRef(),
    year: useRef(),
    bankName: useRef(),
    type: useRef(),
  };
  const handleOptionSelection = (event) => {
    const selectedIndex = event.target.value;
    setSelectedOptionIndex(selectedIndex);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const time = new Date();

    const cardInfo = Object.values(formRefs).map((item) => item.current.value);
    //57-68: Validates the date.
    if (parseFloat(cardInfo[2]) > 12 || parseFloat(cardInfo[2]) < 1) {
      setMonthValid(false);
      return;
    } else {
      //If year is current year, expiration month should be later than the current month
      if (parseFloat(cardInfo[3]) === time.getFullYear()) {
        setMonthValid(parseFloat(cardInfo[2]) > time.getMonth() + 1);
        return;
      }
      setMonthValid(true);
    }
    //If year is earlier than current year or bigger than 2050, its invalid
    if (
      parseFloat(cardInfo[3]) < time.getFullYear() ||
      parseFloat(cardInfo[3]) > 2050
    ) {
      setYearValid(false);
      return;
    } else {
      setYearValid(true);
    }
    //make a new card object to pass to firebase using the form data
    const newCard = {
      cardNum: cardInfo[0],
      holderName: cardInfo[1],
      expDate: cardInfo[2] + "/" + cardInfo[3],
      bankName: cardInfo[4],
      type:
        selectedOptionIndex >= 0 && selectedOptionIndex < optionsArray.length
          ? optionsArray[selectedOptionIndex].value
          : "", // Use empty string as default
      introductionDate: time.getTime(),
      totalSum: 0,
    };
    createWalletAndCardsFolders(localStorage.getItem("userLogged"), newCard);
    props.cancelAddition();
  };

  return (
    <div className={styles.container}>
      <div className={styles.addCard}>
        <div className={styles.title}>Add New Credit/Debit Card</div>
        <div className={styles.imgContainer}>
          <LazyLoad>
            <img src={imgSource} alt="x" />
          </LazyLoad>
        </div>

        <form className={styles.data} id="cardForm" onSubmit={submitHandler}>
          <div className={styles.firstInputs}>
            <div>
              <input
                placeholder="0123456789012345"
                type="text"
                maxLength={16}
                minLength={16}
                ref={formRefs.cardNum}
                value={cardNum}
                onChange={(e) => setCardNum(e.target.value)}
              />
            </div>
            <div>
              <input
                placeholder="Cardholder Name"
                type="text"
                ref={formRefs.name}
                required
              />
            </div>
            <div>
              <input
                placeholder="CVC"
                type="number"
                minLength={3}
                maxLength={3}
              />
              <input
                placeholder="04"
                type="text"
                style={{
                  backgroundColor: monthValid ? "white" : "red",
                }}
                minLength={2}
                maxLength={2}
                ref={formRefs.month}
              />
              <input
                placeholder="2024"
                type="text"
                minLength={4}
                maxLength={4}
                style={{
                  backgroundColor: yearValid ? "white" : "red",
                }}
                ref={formRefs.year}
              />
            </div>
          </div>
          {/**/}
          <div className={styles.secondInputs}>
            <div>
              <div>Bank Name</div>
              <input placeholder="Bank Name" ref={formRefs.bankName} />
            </div>
            <div>
              <div>Card Issuer</div>
              <select
                ref={formRefs.type}
                value={selectedOptionIndex}
                onChange={handleOptionSelection}
              >
                <option value={-1} disabled>
                  Please select an option
                </option>
                {optionsArray.map((option, index) => (
                  <option key={index} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <div className={styles.btnHolder}>
          <button className={styles.btn} onClick={() => props.cancelAddition()}>
            Cancel
          </button>
          <button className={styles.btn} type="submit" form="cardForm">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default CardAddition;
//This component is responsible for adding a new credit card to the wallet of the user
