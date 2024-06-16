import { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import Card from "../UI/Wallet/Card";
import styles from "./Wallet.module.css";
import CardAddition from "./CardAddition";
import { useNavigate } from "react-router";
import { setupCardsListener } from "../firebase";
import {
  readUserData,
  readUserFinanceDetails,
  setupMoneyListener,
} from "../firebase";
import TopUp from "./TopUp";
import LoadingScreen from "../LoadingScreen";
const Wallet = () => {
  const [userName, setUserName] = useState("");
  const [topUp, setTopUp] = useState(false);
  const [userFinanceDetails, setUserFinanceDetails] = useState(null);
  const [cardAddition, setCardAddition] = useState(false);
  const [money, setMoney] = useState(0);

  const [allCards, setAllCards] = useState([]);
  const navigate = useNavigate();
  //Store all card images inside an object
  const cardImages = {
    Mastercard: "/images/logomaster.png",
    VISA: "/images/visa.png",
    Square: "/images/square.png",
    AmericanExpress: "/images/americanexpress.png",
    Paypal: "/images/paypal.png",
  };
  //33-48:  if user is logged in, extract the user's name and financial details
  useEffect(() => {
    const userLoggedATM = localStorage.getItem('userLogged');
    if (userLoggedATM === null) {
      navigate("/profile");
      return;
    }
    readUserData(userLoggedATM).then((userData) => {
      setUserName(userData.fullName);
    });

    readUserFinanceDetails(userLoggedATM).then(
      (userData) => {
        setUserFinanceDetails(userData);
      }
    );
  }, [navigate]);
  //subscribe to the changes that will take place in userFinanceDetails: 
  useEffect(() => {
    const userLoggedATM= localStorage.getItem('userLogged');
    setupMoneyListener(userLoggedATM, setMoney);
    const unsubscribe = setupCardsListener(
      userLoggedATM,
      setAllCards
    );
    return () => unsubscribe();
  }, [userFinanceDetails]);


  if (userFinanceDetails) {
    return (
      <div className={styles.container}>
        <Navbar />
        {cardAddition && (
          <CardAddition cancelAddition={() => setCardAddition(false)} />
        )}
        {topUp && (
          <TopUp cards={allCards} cancelTopUp={() => setTopUp(false)} />
        )}
        <div className={styles.wallet}>
          <div className={styles.figures}>
            <div>{userName}</div>
            <div>
              $ {money.toFixed(3)}{" "}
              <i class="fa-solid fa-plus" onClick={() => setTopUp(true)}></i>
            </div>
          </div>
          <div className={styles.cards}>
            <div className={styles.adder}>
              Debit/Credit Cards
              <i
                class="fa-solid fa-square-plus"
                style={{ color: "#000000" }}
                onClick={() => setCardAddition(true)}></i>
            </div>
            <div className={styles.card}>
              {allCards ? (
                Object.values(allCards).map((card) => {
                  const { type, ...otherCardData } = card;
                  const cardImageUrl = cardImages[type] || null; // Use a default image if type is not found
                  return (
                    <Card
                      key={card.introductionDate}
                      data={{ ...otherCardData, cardImageUrl }}
                    />
                  );
                })
              ) : (
                <p>No cards found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingScreen />;
  }
};
export default Wallet;
//This component is responsible for showcasing the cards and the money of the user. 