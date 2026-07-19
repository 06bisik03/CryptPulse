import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../UI/Navbar";
import Card from "../UI/Wallet/Card";
import styles from "./Wallet.module.css";
import CardAddition from "./CardAddition";
import TopUp from "./TopUp";
import LoadingScreen from "../LoadingScreen";
import AuthContext from "../Store/user-ctx";
import { auth, ensureUserRecord, readUserData, setupCardsListener, setupMoneyListener } from "../firebase";
import { formatCurrency, toNumber } from "../utils/market";

const cardImages = {
  Mastercard: "/images/logomaster.png",
  VISA: "/images/visa.png",
  Square: "/images/square.png",
  AmericanExpress: "/images/americanexpress.png",
  Paypal: "/images/paypal.png",
};

const Wallet = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [money, setMoney] = useState(0);
  const [cards, setCards] = useState({});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authContext.authReady) return;
    if (!authContext.isLoggedIn || !authContext.currentUser) {
      navigate("/profile", { replace: true });
      return;
    }

    let active = true;
    const loadProfile = async () => {
      setLoading(true);
      try {
        let user = await readUserData(authContext.currentUser);
        if (!user && auth.currentUser) user = await ensureUserRecord(auth.currentUser);
        if (active) setUserName(user?.fullName || "CryptPulse member");
      } catch {
        if (active) setError("Your wallet profile could not be refreshed. Live balances may be delayed.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProfile();
    return () => { active = false; };
  }, [authContext.authReady, authContext.currentUser, authContext.isLoggedIn, navigate]);

  useEffect(() => {
    if (!authContext.currentUser) return undefined;
    const unsubscribeMoney = setupMoneyListener(authContext.currentUser, (value) => setMoney(toNumber(value)));
    const unsubscribeCards = setupCardsListener(authContext.currentUser, (value) => setCards(value && typeof value === "object" ? value : {}));
    return () => { unsubscribeMoney(); unsubscribeCards(); };
  }, [authContext.currentUser]);

  const cardList = useMemo(() => Object.values(cards || {}), [cards]);
  const totalFunded = cardList.reduce((total, card) => total + toNumber(card.totalSum), 0);

  if (!authContext.authReady || loading) return <LoadingScreen label="Opening secure wallet" />;

  return (
    <div className={styles.page}>
      <Navbar />
      {modal === "card" && <CardAddition cancelAddition={() => setModal(null)} />}
      {modal === "topup" && <TopUp cards={cards} cancelTopUp={() => setModal(null)} />}

      <main className={styles.main}>
        <header className={styles.heading}>
          <div><span>Private cash account</span><h1>Wallet reserve</h1><p>Available liquidity and connected funding instruments for {userName}.</p></div>
          <span className={styles.secure}><i /> Secure session</span>
        </header>

        {error && <div className={styles.notice}>{error}</div>}

        <section className={styles.balanceCard}>
          <div className={styles.balanceTop}><span>Available to trade</span><small>USD reserve</small></div>
          <strong>{formatCurrency(money)}</strong>
          <div className={styles.balanceBottom}>
            <div><span>Lifetime funded</span><b>{formatCurrency(totalFunded)}</b></div>
            <div><span>Funding methods</span><b>{cardList.length}</b></div>
            <button type="button" onClick={() => setModal("topup")} disabled={!cardList.length}>Add funds <span>＋</span></button>
          </div>
          <div className={styles.balanceGlow} aria-hidden="true" />
        </section>

        <section className={styles.cardsPanel}>
          <div className={styles.panelHeader}>
            <div><span>Payment rails</span><h2>Connected cards</h2></div>
            <button type="button" onClick={() => setModal("card")}>Add card <span>＋</span></button>
          </div>
          <div className={styles.cardHeader}><span>Issuer</span><span>Card</span><span>Cardholder</span><span>Expires</span><span>Total funded</span></div>
          <div className={styles.cards}>
            {cardList.length ? cardList.map((card, index) => <Card key={card.introductionDate || index} data={{ ...card, cardImageUrl: cardImages[card.type] || "" }} />) : <div className={styles.empty}><span>◇</span><h3>No cards connected</h3><p>Add a funding method to top up your wallet reserve.</p></div>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wallet;
