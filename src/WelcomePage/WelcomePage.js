import React from "react";
import styles from "./WelcomePage.module.css";
import Navbar from "../UI/Navbar";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.detail}>
          <div>
            Empowering Your Crypto Investments: CryptPulse <br /> Your Path to
            Financial Growth!
          </div>

          <Link to="/profile" className={styles.link}>
            Start!
          </Link>
          <div>
            <div className={styles.card}>
              <a
                href="#"
                className={`${styles.socialContainer} ${styles.containerOne}`}>
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="#"
                className={`${styles.socialContainer} ${styles.containerTwo}`}>
                <i className="fab fa-twitter"></i>
              </a>

              <a
                href="#"
                className={`${styles.socialContainer} ${styles.containerThree}`}>
                <i className="fab fa-linkedin"></i>
              </a>

              <a
                href="#"
                className={`${styles.socialContainer} ${styles.containerFour}`}>
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
