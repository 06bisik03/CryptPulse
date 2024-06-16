import styles from "./Mentoring.module.css";
import Navbar from "../UI/Navbar";
import Perks from "../UI/Mentoring/Perks";
import Steps from "../UI/Mentoring/Steps";
import { Link } from "react-router-dom";
const Mentoring = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container1}>
        <Navbar />
        <div className={styles.message}>
          <h1>Guiding Your Crypto Ambitions to New Heights</h1>
          <div>
            Whether you're a beginner exploring the world of cryptocurrencies or
            an experienced trader looking to refine your strategies, our pool of
            skilled mentors is here to assist you at every step of your crypto
            journey. Our mentors have extensive backgrounds in the crypto space
            and have navigated the volatile markets with expertise.
          </div>
          <Link className={styles.link} to="/mentoringsystems">
            {" "}
            I'M READY
          </Link>
        </div>
        <Steps />
      </div>
      <div classname={styles.container2}>
        <div className={styles.secondPage}>
          <Perks />
          <div className={styles.rightGrid}>x</div>
        </div>
      </div>
    </div>
  );
};
export default Mentoring;
