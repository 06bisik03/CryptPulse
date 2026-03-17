import styles from "./Graph.module.css";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const formatPercent = (value) => `${value.toFixed(value < 10 ? 2 : 1)}%`;

const Graph = (props) => {
  const deposits = Number(props.investments.deposits || 0);
  const investments = Number(props.investments.investments || 0);
  const totalFlow = Number(props.investments.totalFlow || deposits + investments);
  const safeTotal = totalFlow > 0 ? totalFlow : deposits + investments;
  const depositShare = safeTotal > 0 ? (deposits / safeTotal) * 100 : 0;
  const investmentShare = safeTotal > 0 ? (investments / safeTotal) * 100 : 0;
  const dominantAmount = Math.max(deposits, investments, 1);
  const depositScale = deposits > 0 ? Math.max((deposits / dominantAmount) * 100, 12) : 0;
  const investmentScale =
    investments > 0 ? Math.max((investments / dominantAmount) * 100, 12) : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.totalBar} aria-label="Cashflow composition">
        <div
          className={`${styles.segment} ${styles.depositSegment}`}
          style={{ width: `${depositShare}%` }}
        />
        <div
          className={`${styles.segment} ${styles.investmentSegment}`}
          style={{ width: `${investmentShare}%` }}
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.depositSwatch}`}></span>
          <span>Deposits</span>
          <strong>{formatPercent(depositShare)}</strong>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.investmentSwatch}`}></span>
          <span>Invested</span>
          <strong>{formatPercent(investmentShare)}</strong>
        </div>
      </div>

      <div className={styles.rows}>
        <div className={styles.row}>
          <div className={styles.rowHeader}>
            <div className={styles.rowLabel}>
              <span className={`${styles.swatch} ${styles.depositSwatch}`}></span>
              <span>Deposits</span>
            </div>
            <strong>{formatMoney(deposits)}</strong>
          </div>
          <div className={styles.track}>
            <div
              className={`${styles.fill} ${styles.depositFill}`}
              style={{ width: `${depositScale}%` }}
            />
          </div>
          <div className={styles.caption}>Share of total flow: {formatPercent(depositShare)}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowHeader}>
            <div className={styles.rowLabel}>
              <span className={`${styles.swatch} ${styles.investmentSwatch}`}></span>
              <span>Invested</span>
            </div>
            <strong>{formatMoney(investments)}</strong>
          </div>
          <div className={styles.track}>
            <div
              className={`${styles.fill} ${styles.investmentFill}`}
              style={{ width: `${investmentScale}%` }}
            />
          </div>
          <div className={styles.caption}>
            Capital allocation: {formatPercent(investmentShare)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
