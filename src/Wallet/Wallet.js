import { useContext, useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import Card from "../UI/Wallet/Card";
import styles from "./Wallet.module.css";
import CardAddition from "./CardAddition";
import { useNavigate } from "react-router";
import { setupCardsListener } from "../firebase";
import {
  auth,
  createDefaultUserFinanceDetails,
  ensureUserRecord,
  readUserData,
  readUserFinanceDetails,
  setupMoneyListener,
} from "../firebase";
import TopUp from "./TopUp";
import LoadingScreen from "../LoadingScreen";
import AuthContext from "../Store/user-ctx";

const Wallet = () => {
  const [userName, setUserName] = useState("");
  const [topUp, setTopUp] = useState(false);
  const [userFinanceDetails, setUserFinanceDetails] = useState(null);
  const [cardAddition, setCardAddition] = useState(false);
  const [money, setMoney] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

  const [allCards, setAllCards] = useState([]);
  const navigate = useNavigate();
  const authctx = useContext(AuthContext);
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
    let isMounted = true;

    if (!authctx.authReady) {
      return;
    }

    if (!authctx.isLoggedIn || !authctx.currentUser) {
      navigate("/profile");
      return;
    }

    const loadWalletData = async () => {
      setWalletLoading(true);
      setWalletError("");

      try {
        const [userData, financeData] = await Promise.all([
          readUserData(authctx.currentUser),
          readUserFinanceDetails(authctx.currentUser),
        ]);

        let nextUserData = userData;
        let nextFinanceData = financeData;

        if ((!nextUserData || !nextFinanceData) && auth.currentUser) {
          const ensuredUserData = await ensureUserRecord(auth.currentUser);
          nextUserData = nextUserData || ensuredUserData;
          nextFinanceData = nextFinanceData || ensuredUserData.userFinanceDetails;
        }

        if (!isMounted) {
          return;
        }

        setUserName(nextUserData?.fullName || "");
        setUserFinanceDetails(
          nextFinanceData || createDefaultUserFinanceDetails()
        );
      } catch (error) {
        console.error("Error loading wallet data:", error);

        if (!isMounted) {
          return;
        }

        setWalletError("Wallet data could not be loaded.");
        setUserFinanceDetails(createDefaultUserFinanceDetails());
      } finally {
        if (isMounted) {
          setWalletLoading(false);
        }
      }
    };

    loadWalletData();

    return () => {
      isMounted = false;
    };
  }, [authctx.authReady, authctx.currentUser, authctx.isLoggedIn, navigate]);

  //subscribe to the changes that will take place in userFinanceDetails: 
  useEffect(() => {
    if (!authctx.authReady || !authctx.isLoggedIn || !authctx.currentUser) {
      return undefined;
    }

    const unsubscribeMoney = setupMoneyListener(authctx.currentUser, setMoney);
    const unsubscribeCards = setupCardsListener(
      authctx.currentUser,
      setAllCards
    );

    return () => {
      unsubscribeMoney();
      unsubscribeCards();
    };
  }, [
    authctx.authReady,
    authctx.currentUser,
    authctx.isLoggedIn,
    userFinanceDetails,
  ]);

  if (!authctx.authReady) {
    return <LoadingScreen />;
  }

  if (walletLoading) {
    return <LoadingScreen />;
  }

  if (userFinanceDetails) {
    return (
      <div className={styles.container}>
        <Navbar />
        {walletError ? <p>{walletError}</p> : null}
        {cardAddition && (
          <CardAddition cancelAddition={() => setCardAddition(false)} />
        )}
        {topUp && (
          <TopUp cards={allCards} cancelTopUp={() => setTopUp(false)} />
        )}
        <div className={styles.wallet}>
          <div className={styles.figures}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.balance}>
              <span className={styles.balanceAmount}>$ {money.toFixed(3)}</span>
              <button
                type="button"
                className={styles.balanceAction}
                onClick={() => setTopUp(true)}
                aria-label="Top up wallet">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div className={styles.cards}>
            <div className={styles.adder}>
              <span>Debit/Credit Cards</span>
              <button
                type="button"
                className={styles.cardAddButton}
                onClick={() => setCardAddition(true)}
                aria-label="Add card">
                <i className="fa-solid fa-square-plus"></i>
              </button>
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
