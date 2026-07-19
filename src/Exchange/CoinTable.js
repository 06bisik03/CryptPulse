import { useDeferredValue, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TableCoin from "../UI/Exchange/TableCoin";
import styles from "./CoinTable.module.css";

const sortModes = {
  rank: (a, b) => a.market_cap_rank - b.market_cap_rank,
  price: (a, b) => b.current_price - a.current_price,
  change: (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  marketCap: (a, b) => b.market_cap - a.market_cap,
  volume: (a, b) => b.total_volume - a.total_volume,
};

const CoinTable = () => {
  const coins = useSelector((state) => state.api.generalCoins);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleCoins = useMemo(() => {
    const matches = coins.filter((coin) =>
      `${coin.name} ${coin.symbol}`.toLowerCase().includes(deferredQuery)
    );
    return matches.sort(sortModes[sortBy]);
  }, [coins, deferredQuery, sortBy]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <span className={styles.kicker}>Spot universe</span>
          <h2>All markets <small>{visibleCoins.length}</small></h2>
        </div>
        <div className={styles.controls}>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <span className={styles.srOnly}>Search assets</span>
            <input
              type="search"
              placeholder="Search asset or ticker"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className={styles.sort}>
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="rank">Market rank</option>
              <option value="price">Highest price</option>
              <option value="change">24h momentum</option>
              <option value="marketCap">Market cap</option>
              <option value="volume">24h volume</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.table} role="table" aria-label="Cryptocurrency markets">
        <div className={styles.header} role="row">
          <div className={styles.rank} role="columnheader">#</div>
          <div className={styles.asset} role="columnheader">Asset</div>
          <div className={styles.price} role="columnheader">Price</div>
          <div className={styles.change} role="columnheader">24h</div>
          <div className={styles.cap} role="columnheader">Market cap</div>
          <div className={styles.volume} role="columnheader">Volume 24h</div>
          <div className={styles.chart} role="columnheader">7d trend</div>
          <div className={styles.action} role="columnheader">Trade</div>
        </div>
        <div className={styles.rows} role="rowgroup">
          {visibleCoins.length ? (
            visibleCoins.map((coin) => <TableCoin coin={coin} key={coin.id} />)
          ) : (
            <div className={styles.empty}>No assets match “{query}”.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinTable;
