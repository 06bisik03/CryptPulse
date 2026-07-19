import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Filters.module.css";
import ElementFilter from "../UI/Exchange/ElementFilter";

const modes = [
  { id: "leaders", label: "Market leaders" },
  { id: "gainers", label: "Top gainers" },
  { id: "losers", label: "Top losers" },
];

const Filters = () => {
  const [mode, setMode] = useState("leaders");
  const coins = useSelector((state) => state.api.generalCoins);

  const filtered = useMemo(() => {
    const sorted = [...coins];
    if (mode === "gainers") sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    if (mode === "losers") sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    if (mode === "leaders") sorted.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
    return sorted.slice(0, 4);
  }, [coins, mode]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} role="tablist" aria-label="Market highlights">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? styles.active : ""}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.highlights}>
        {filtered.map((coin) => <ElementFilter key={coin.id} coin={coin} />)}
      </div>
    </div>
  );
};

export default Filters;
