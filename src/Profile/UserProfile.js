import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../UI/Navbar";
import styles from "./UserProfile.module.css";
import Coin from "../UI/UserSpec/Coin";
import Graph from "../UI/UserSpec/Graph";
import PastTransaction from "../UI/UserSpec/PastTransaction";
import { setupTransactionsListener, setupAccountFlowListener, setupCoinsListener } from "../firebase";
import { fetcherGeneral } from "../redux/Api";
import AuthContext from "../Store/user-ctx";
import { formatCurrency, toNumber } from "../utils/market";

const safeFlow = (flow) => ({
  deposits: toNumber(flow?.deposits),
  investments: toNumber(flow?.investments),
  totalFlow: toNumber(flow?.totalFlow),
});

const UserProfile = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const marketCoins = useSelector((state) => state.api.generalCoins);
  const [transactions, setTransactions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [accountFlow, setAccountFlow] = useState(safeFlow());

  useEffect(() => {
    dispatch(fetcherGeneral());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.currentUser) return undefined;
    const unsubscribeCoins = setupCoinsListener(auth.currentUser, (value) => setPositions(Array.isArray(value) ? value : []));
    const unsubscribeTransactions = setupTransactionsListener(auth.currentUser, (value) => setTransactions(Array.isArray(value) ? value : []));
    const unsubscribeFlow = setupAccountFlowListener(auth.currentUser, setAccountFlow);
    return () => { unsubscribeCoins(); unsubscribeTransactions(); unsubscribeFlow(); };
  }, [auth.currentUser]);

  const enrichedPositions = useMemo(() => positions.map((position) => ({
    position,
    market: marketCoins.find((coin) => coin.id === position.coinId || coin.name === position.coinName),
  })), [marketCoins, positions]);

  const portfolioValue = enrichedPositions.reduce((total, item) => total + toNumber(item.position.coinAmount) * toNumber(item.market?.current_price, item.position.coinBuyPrice), 0);
  const costBasis = positions.reduce((total, position) => total + toNumber(position.totalSum), 0);
  const pnl = portfolioValue - costBasis;

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.heading}>
          <div><span>Private portfolio</span><h1>Capital overview</h1><p>Your positions, cashflow and execution history in one workspace.</p></div>
          <div className={styles.portfolioValue}><span>Portfolio value</span><strong>{formatCurrency(portfolioValue)}</strong><small className={pnl < 0 ? styles.negative : ""}>{pnl >= 0 ? "+" : ""}{formatCurrency(pnl)} unrealized</small></div>
        </header>

        <section className={styles.metrics}>
          <article><span>Total deposits</span><strong>{formatCurrency(accountFlow.deposits)}</strong><small>Lifetime wallet funding</small></article>
          <article><span>Capital deployed</span><strong>{formatCurrency(accountFlow.investments)}</strong><small>Across open and closed orders</small></article>
          <article><span>Net account flow</span><strong>{formatCurrency(accountFlow.totalFlow)}</strong><small>Deposits plus market activity</small></article>
        </section>

        <div className={styles.workspace}>
          <section className={styles.positionsPanel}>
            <div className={styles.panelHeader}><div><span>Open exposure</span><h2>Positions</h2></div><small>{positions.length} assets</small></div>
            <div className={styles.positions}>
              {enrichedPositions.length ? enrichedPositions.map(({ position, market }) => (
                <Coin coin={position} currentData={market} key={position.timeOfBuy || `${position.coinName}-${position.coinAmount}`} />
              )) : (
                <div className={styles.empty}><span>◇</span><h3>No open positions</h3><p>Your active assets will appear here after your first order.</p><a href="/exchange">Explore markets →</a></div>
              )}
            </div>
          </section>

          <section className={styles.flowPanel}>
            <div className={styles.panelHeader}><div><span>Allocation</span><h2>Cashflow</h2></div><small>Lifetime</small></div>
            <Graph investments={accountFlow} />
          </section>
        </div>

        <section className={styles.history}>
          <div className={styles.panelHeader}><div><span>Audit trail</span><h2>Transaction history</h2></div><small>{transactions.length} records</small></div>
          <div className={styles.historyHeader}><span>Date</span><span>Asset</span><span>Type</span><span>Quantity</span><span>Total</span></div>
          <div className={styles.transactionContainer}>
            {transactions.length ? transactions.map((transaction, index) => <PastTransaction key={transaction.timeOfBuy || transaction.timeOfSell || index} transaction={transaction} />) : <div className={styles.noTransactions}>No transactions have been recorded yet.</div>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
