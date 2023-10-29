import { useSelector } from "react-redux";
import Navbar from "../UI/Navbar";
import styles from "./UserProfile.module.css";
import Coin from "../UI/UserSpec/Coin";
import Graph from "../UI/UserSpec/Graph";
import PastTransaction from "../UI/UserSpec/PastTransaction";
import {
  setupTransactionsListener,
  setupAccountFlowListener,
  setupCoinsListener,
} from "../firebase";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { useDispatch } from "react-redux";
import { fetcherGeneral } from "../redux/Api";
const UserProfile = () => {
  const generalCoins = useSelector((state) => state.api.generalCoins);
  const [transactions, setTransactions] = useState([]);
  const [coins, setCoins] = useState([]);
  const [filteredGeneralCoins, setFilteredGeneralCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [accountFlow, setAccountFlow] = useState({
    deposits: 0,
    investments: 0,
    totalFlow: 0,
  });
  const dispatch = useDispatch();
  const userLog = localStorage.getItem('userLogged');
  useEffect(() => {
    const userLoggedATM = localStorage.getItem("userLogged");
    //32-40: The listener are going to call these functions when the data changes. They change the states of the variables we declared at the beginning.
    const handleAccountFlowChange = (accountFlowData) => {
      setAccountFlow(accountFlowData);
    };
    const handleCoinsChange = (coinsArray) => {
      setCoins(coinsArray);
    };
    const handleTransactionsChange = (transactionsArray) => {
      setTransactions(transactionsArray);
    };
    //40-43: Listeners for whenever the data we rely on changes
    setupCoinsListener(userLoggedATM, handleCoinsChange);
    setupTransactionsListener(userLoggedATM, handleTransactionsChange);
    setupAccountFlowListener(userLoggedATM, handleAccountFlowChange);
  }, [userLog]);
  //dispatch fetch action in another hook to prevent calling it when the other data changes
  useEffect(() => {
    dispatch(fetcherGeneral());
  }, [dispatch]);
  //50-62: if the coins are fetched and received, filter them from the general Coins that is directly from the api, to have more information about the coin. Otherwise do not show the page.
  useEffect(() => {
    if (generalCoins.length > 0 && coins.length > 0) {
      const filterForDetail = generalCoins.filter((generalCoin) =>
        coins.some((coin) => coin.coinName === generalCoin.name)
      );
      setFilteredGeneralCoins(filterForDetail);
      setLoading(false);
    } else if (coins) {
      setFilteredGeneralCoins([0]);
    } else {
      setLoading(true);
    }
  }, [generalCoins, coins]);

  useEffect(() => {
    // If filteredGeneralCoins is still empty, set loading to true
    if (filteredGeneralCoins.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [filteredGeneralCoins]);

  if (loading) {
    return <LoadingScreen />;
  } else {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.details}>
          <div className={styles.coins}>
            {coins.length > 0 && filteredGeneralCoins[0] !== 0 ? (
              coins.map((coin) => {
                console.log(coins);
                return (
                  <Coin
                    coin={coin}
                    key={coin.timeOfBuy}
                    currentData={filteredGeneralCoins.filter(
                      (item) => item.name === coin.coinName
                    )}
                  />
                );
              })
            ) : (
              <div className={styles.noInvestment}>
                No investment was made yet!
              </div>
            )}
          </div>

          <div className={styles.accountState}>
            <div className={styles.graph}>
              <div className={styles.currentFlow}>
                <div>Account Total Cashflow</div>
                <div className={styles.currentFlowFigures}>
                  <div>
                    Deposits:
                    <br /> ${accountFlow.deposits.toFixed(2)}
                  </div>
                  <div>
                    Invested: <br />${accountFlow.investments.toFixed(2)}
                  </div>
                  <div>
                    Total Flow:
                    <br /> ${accountFlow.totalFlow.toFixed(2)}
                  </div>
                </div>
              </div>
              <Graph investments={accountFlow} />
            </div>
            <div className={styles.pastTransactions}>
              <div className={styles.title}>Past Transactions</div>
              <div className={styles.transactionContainer}>
                {transactions ? (
                  transactions.map((item) => (
                    <PastTransaction key={item.timeOfBuy} transaction={item} />
                  ))
                ) : (
                  <div className={styles.noTrs}>
                    No Transactions found yet!{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default UserProfile;
//This component is responsible for showing the profile of the user that is currently logged in.
