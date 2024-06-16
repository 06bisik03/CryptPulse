import styles from "./SaleError.module.css";
import btnStyles from "../../UI/Exchange/Purchased.module.css";
const SaleError = (props) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.errorModal}>
        <div>
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className={styles.content}>
          <div>OOPS!</div>
          <div>
            There was a problem carrying out the transaction. Please contact our
            team.
          </div>
        </div>
        <div>
          <button
            className={`${btnStyles.btn} ${styles.btn}`}
            onClick={() => props.onCancel()}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
export default SaleError;
//This component shows up when there is a problem that occured while selling or purchasing a coin.