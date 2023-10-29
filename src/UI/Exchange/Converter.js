import styles from "./Converter.module.css";

import { useState} from "react";
import Confirmation from "./Confirmation";
import { NumberFormatter3 } from "../../Store/NumberFormatters";
import LoadingScreen from "../../LoadingScreen";

const Converter = (props) => {
  const [usdField, setUsdField] = useState("");
  const [cryptoField, setCryptoField] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formInvalid, setFormInvalid] = useState(false);
  //13-28: Both these functions are responsible for changing the other field, when their respective field is changed by making use of the exchange rate
  const CryptoGiven = (event) => {
    const coinInUsd = props.coin[0].current_price;
    const amountInCoin = event.target.value;
    setCryptoField(event.target.value);
    const exchangeToUsd = amountInCoin * coinInUsd;
    setUsdField(exchangeToUsd);
  };

  const UsdGiven = (event) => {
    const coinInUsd = props.coin[0].current_price;
    const amountInUsd = event.target.value;
    setUsdField(event.target.value);
    const exchangeToCoin = amountInUsd / coinInUsd;
    setCryptoField(exchangeToCoin);
  };
  
  //the form is only valid if none of the fields is empty
  const checkValidity = () => {
    if (!usdField || !cryptoField) {
      setFormInvalid(true);
      setShowConfirmation(false);
    } else {
      setFormInvalid(false);
      setShowConfirmation(true);
    }
  };
  if (!props.coin[0]) {
    return <LoadingScreen/>
    //props.coin[0]
  } else {
    const circulatingSupply = NumberFormatter3(
      parseFloat(props.coin[0].circulating_supply)
    );
    const totalSupply = NumberFormatter3(
      parseFloat(props.coin[0].total_supply)
    );
    const totalVolume = NumberFormatter3(
      parseFloat(props.coin[0].total_volume)
    );
    const ath = NumberFormatter3(parseFloat(props.coin[0].ath));
    const atl = NumberFormatter3(parseFloat(props.coin[0].atl));
    const ath2 = parseFloat(ath);
    const atl2 = parseFloat(atl);

    return (
      <div className={styles.container}>
        {showConfirmation && (
          <Confirmation
            data={{
              coin: props.coin[0],
              formData: { coinAmount: cryptoField, price: usdField },
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

        <div className={styles.calculator}>
          <div>CURRENCY CONVERTER</div>
          <form className={styles.inputs} id="myform">
            <input
              placeholder={props.coin[0].name}
              onChange={CryptoGiven}
              value={cryptoField}
              style={{
                backgroundColor: formInvalid ? "rgba(255, 0, 0, 0.554)" : null,
              }}
              required
            />
            <div className={styles.arrow}>
              <i className="fa-solid fa-arrow-right-arrow-left fa-rotate-90"></i>
            </div>
            <input
              placeholder="USD"
              value={usdField}
              onChange={UsdGiven}
              style={{
                backgroundColor: formInvalid ? "rgba(255, 0, 0, 0.554)" : null,
              }}
              required
            />
          </form>
          <div className={styles.info}>
            <div>
              Rate: 1 {props.coin[0].name} = ${props.coin[0].current_price}
            </div>
            <button
              onClick={() => {
                checkValidity();
              }}>
              BUY {props.coin[0].name}
            </button>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.title}>BITCOIN STATISTICS</div>
          <div className={styles.prc}>
            <div>{props.coin[0].name} Price</div>
            <div>${props.coin[0].current_price}</div>
          </div>
          <div className={styles.prc}>
            <div>24h low / 24h high </div>
            <div>
              ${props.coin[0].low_24h} / ${props.coin[0].high_24h}
            </div>
          </div>

          <div className={styles.prc}>
            <div>Circulating/Total Supply</div>
            <div>
              ${circulatingSupply} / ${totalSupply}
            </div>
          </div>
          <div className={styles.prc}>
            <div>ATH / ATL</div>
            <div>
              ${ath2} / ${atl2}
            </div>
          </div>
          <div className={styles.prc}>
            <div>Total Volume</div>
            <div>${totalVolume}</div>
          </div>
        </div>
      </div>
    );
  }
};
export default Converter;
//this component is responsible to showcase a calculator that translates the amount of coins into real usd currency and showcases important info about the coin