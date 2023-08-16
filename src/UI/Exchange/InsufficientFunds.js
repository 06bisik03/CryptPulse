import styles from "./InsufficientFunds.module.css";

const InsufficientFunds = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <div>Insufficient Funds</div>
        <div>
          You do not have the sufficient funds to complete this transaction.
          Please top up your account.
        </div>
        <button className={styles.btn} onClick={() => props.onCancel()}>
          OK
        </button>
      </div>
    </div>
  );
};
export default InsufficientFunds;
//This component is responsible for showing user that they lack the funds to make their desired purchase.