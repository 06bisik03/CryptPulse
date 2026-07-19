import styles from "./Graph.module.css";
import { formatCurrency, toNumber } from "../../utils/market";

const Graph = ({ investments = {} }) => {
  const deposits = toNumber(investments.deposits);
  const deployed = toNumber(investments.investments);
  const total = deposits + deployed;
  const depositShare = total > 0 ? (deposits / total) * 100 : 50;
  const investmentShare = total > 0 ? (deployed / total) * 100 : 50;

  return (
    <div className={styles.wrapper}>
      <div className={styles.visual}>
        <div className={styles.ring} style={{ "--deposit-share": `${depositShare * 3.6}deg` }}>
          <div><span>Total flow</span><strong>{formatCurrency(total)}</strong></div>
        </div>
      </div>
      <div className={styles.legend}>
        <div><span className={styles.depositDot} /><span>Deposits</span><strong>{formatCurrency(deposits)}</strong><small>{depositShare.toFixed(1)}%</small></div>
        <div><span className={styles.investmentDot} /><span>Deployed</span><strong>{formatCurrency(deployed)}</strong><small>{investmentShare.toFixed(1)}%</small></div>
      </div>
    </div>
  );
};

export default Graph;
