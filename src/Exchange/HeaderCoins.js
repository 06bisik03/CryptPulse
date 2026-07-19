import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./HeaderCoins.module.css";
import Filters from "./Filters";
import { formatCompact, formatCurrency, formatPercent } from "../utils/market";

const HeaderCoins = () => {
  const global = useSelector((state) => state.api.globalData?.data);
  const { source, status, lastUpdated, error } = useSelector((state) => state.api);

  const stats = [
    { label: "Global market cap", value: formatCurrency(global?.total_market_cap?.usd, { compact: true }), trend: formatPercent(global?.market_cap_change_percentage_24h_usd) },
    { label: "24h market volume", value: formatCurrency(global?.total_volume?.usd, { compact: true }), note: "Across tracked venues" },
    { label: "Bitcoin dominance", value: `${Number(global?.market_cap_percentage?.btc || 0).toFixed(1)}%`, note: "Share of total market" },
    { label: "Active assets", value: formatCompact(global?.active_cryptocurrencies || 0), note: "Global crypto universe" },
  ];

  const statusLabel = status === "refreshing" ? "Refreshing" : source === "live" ? "Live data" : source === "cached" ? "Cached market" : "Demo market";

  return (
    <section className={styles.container}>
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>Market intelligence / Spot</span>
          <h1>Digital asset markets</h1>
          <p>Liquidity, momentum and price structure in one high-signal view.</p>
        </div>
        <div className={styles.headingMeta}>
          <span className={`${styles.status} ${source !== "live" ? styles.alt : ""}`}>
            <i /> {statusLabel}
          </span>
          <small>{lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Establishing market feed"}</small>
          <Link to="/exchange/showroom">Market brief →</Link>
        </div>
      </div>

      {error && source !== "live" && (
        <div className={styles.notice} role="status">
          Live data is delayed. CryptPulse is using a verified {source} snapshot so the market remains available.
        </div>
      )}

      <div className={styles.stats}>
        {stats.map((stat) => (
          <article key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small className={stat.trend?.startsWith("-") ? styles.down : ""}>{stat.trend || stat.note}</small>
          </article>
        ))}
      </div>

      <Filters />
    </section>
  );
};

export default HeaderCoins;
