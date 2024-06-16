import LazyLoad from "react-lazy-load";
import styles from "./Card.module.css";
const Card = (props) => {
  //the time the card has first been introduced to the system
  const introTime = new Date(props.data.introductionDate)
    .toISOString()
    .substring(0, 10);
  return (
    <div className={styles.container}>
      <div>
        <LazyLoad>
          <img alt="x" src={props.data.cardImageUrl} />
        </LazyLoad>
      </div>
      <div>{props.data.cardNum}</div>
      <div>{props.data.holderName}</div>
      <div>Expires on: {props.data.expDate}</div>
      <div>Introduced on: {introTime}</div>
      <div>Charged: ${props.data.totalSum}</div>
    </div>
  );
};
export default Card;

/* This component represent every Card that has been added and will be displayed as an item inside the container which can be found in Wallet.js */
