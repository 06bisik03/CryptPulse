import styles from "./ContactPage.module.css";
import Navbar from "../UI/Navbar";
import { Link } from "react-router-dom";
import Choice from "./Choice";
import { useState } from "react";

import SentForm from "./SentForm";
import LazyLoad from "react-lazy-load";
const ContactPage = () => {
  const [reasonChosen, setReasonChosen] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <>
      {!reasonChosen ? (
        <div className={styles.container}>
          <Navbar />
          <div className={styles.form}>
            <div className={styles.logo}>
              <LazyLoad>
                <img alt="x" src="/images/finallogo.png" />
              </LazyLoad>
            </div>
            <div className={styles.exp}>
              Please select the reason of contact.
            </div>
            <div className={styles.formHolder}>
              <div className={styles.dropdown}>
                <button className={styles.dropdownBtn} aria-haspopup="menu">
                  <span>Contact Reason</span>
                  <span className={styles.arrow}></span>
                </button>
                <ul className={styles.dropdownContent} role="menu">
                  <li style={{ "--delay": 1 }}>
                    <Link
                      to="forms?form=ti"
                      onClick={() => setReasonChosen(true)}
                    >
                      Technical Issues
                    </Link>
                  </li>
                  <li style={{ "--delay": 2 }}>
                    <Link to="/mentoring">Mentoring System</Link>
                  </li>
                  <li style={{ "--delay": 3 }}>
                    <Link to="?form=fs" onClick={() => setReasonChosen(true)}>
                      Feedback and Suggestions
                    </Link>
                  </li>
                  <li style={{ "--delay": 4 }}>
                    <Link to="?form=gq" onClick={() => setReasonChosen(true)}>
                      General Questions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : submitted ? (
        <SentForm />
      ) : (
        <Choice
          onCancel={() => setReasonChosen(false)}
          submitHandler={submitHandler}
        />
      )}
    </>
  );
};
export default ContactPage;
//this component is responsible for letting the user choose one out of 4 reasons for contact. According to this an appropriate form shows up, to make the contact more efficient for the receiving end.
