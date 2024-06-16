import React, { useState } from "react";
import styles from "./WelcomePage.module.css";
import Navbar from "../UI/Navbar";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import imgBack from "../Assets/back.jpg";
import LoadingScreen from "../LoadingScreen";

const WelcomePage = () => {
  const [direction, setDirection] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  useEffect(() => {
    //if user is not logged in, force a log in or sign up
    if (localStorage.getItem("userLoggedIn")) {
      setDirection("/exchange");
    } else {
      setDirection("/profile");
    }
    const img = new Image();
    img.src = imgBack; // Replace with your background image path
    img.onload = () => setIsImageLoaded(true);
  }, []);
  if (!isImageLoaded) {
    return <LoadingScreen />;
  } else {
    return (
      <div
        style={{ backgroundImage: `url(${imgBack})` }}
        className={styles.container}
      >
        <Navbar />
        <div className={styles.main}>
          <div className={styles.detail}>
            <div className={styles.title}>
              Empowering Your Crypto Investments: CryptPulse <br /> Your Path to
              Financial Growth!
            </div>

            <Link to={direction} className={styles.button}>
              S T A R T
              <div className={styles.clip}>
                <div className={`${styles.corner} ${styles.leftTop}`}></div>
                <div className={`${styles.corner} ${styles.rightBottom}`}></div>
                <div className={`${styles.corner} ${styles.rightTop}`}></div>
                <div className={`${styles.corner} ${styles.leftBottom}`}></div>
              </div>
              <span className={`${styles.arrow} ${styles.rightArrow}`}></span>
              <span className={`${styles.arrow} ${styles.leftArrow}`}></span>
            </Link>
          </div>
          <div className={styles.cardHolder}>
            <div className={styles.card}>
              <a
                rel="noreferrer"
                href="https://www.instagram.com/cryptpulse/"
                target="_blank"
                className={`${styles.socialContainer} ${styles.containerOne}`}
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                rel="noreferrer"
                href="https://www.instagram.com/cryptpulse/"
                className={`${styles.socialContainer} ${styles.containerTwo}`}
              >
                <i className="fab fa-twitter"></i>
              </a>

              <a
                href="https://www.instagram.com/cryptpulse/"
                className={`${styles.socialContainer} ${styles.containerThree}`}
              >
                <i className="fab fa-linkedin"></i>
              </a>

              <a
                href="https://www.instagram.com/cryptpulse/"
                className={`${styles.socialContainer} ${styles.containerFour}`}
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default WelcomePage;
//This component is the welcome page. it is the index page in the router tree.
