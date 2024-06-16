import Navbar from "../UI/Navbar";
import styles from "./Choice.module.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
const Choice = (props) => {
  const [typeForm, setTypeForm] = useState("");

  const location = useLocation();
  const formMode = new URLSearchParams(location.search).get("form");
  return (
    <div className={styles.container}>
      <Navbar />
      {formMode === "ti" ? (
        <TechnicalProblems
          onCancel={props.onCancel}
          submitHandler={props.submitHandler}
        />
      ) : formMode === "gq" ? (
        <Questions
          onCancel={props.onCancel}
          submitHandler={props.submitHandler}
        />
      ) : (
        <Feedback
          setType={(e) => setTypeForm(e)}
          typeForm={typeForm}
          onCancel={props.onCancel}
          submitHandler={props.submitHandler}
        />
      )}
    </div>
  );
};

export default Choice;

const TechnicalProblems = (props) => {
  return (
    <div className={styles.formContainer}>
      <h1>Technical Problems</h1>
      <form className={styles.form} onSubmit={props.submitHandler}>
        <input placeholder="Topic" required />
        <textarea placeholder="Message" required />
        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.back}`}
            onClick={props.onCancel}>
            Back
          </button>
          <button className={styles.btn} type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

const Feedback = (props) => {
  return (
    <div className={styles.formContainer}>
      <h1>Feedback and Suggestions</h1>
      <form className={styles.form} onSubmit={props.submitHandler}>
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownBtn}
            aria-haspopup="menu"
            type="button"
            onClick={() => props.setType("")}>
            <span>
              {props.typeForm === "" ? "Please select" : props.typeForm}
            </span>
            <span className={styles.arrow}></span>
          </button>
          <ul className={styles.dropdownContent} role="menu">
            <li style={{ "--delay": 1 }}>
              <Link onClick={() => props.setType("Feedback")}>Feedback</Link>
            </li>
            <li style={{ "--delay": 2 }}>
              <Link onClick={() => props.setType("Suggestion")}>
                Suggestion
              </Link>
            </li>
          </ul>
        </div>
        {props.typeForm === "Suggestion" ? (
          <>
            <textarea placeholder="Suggestion" required />
            <div className={styles.buttons}>
              <button
                className={`${styles.btn} ${styles.back}`}
                onClick={props.onCancel}>
                Back
              </button>
              <button className={styles.btn} type="submit">
                Submit
              </button>
            </div>
          </>
        ) : props.typeForm === "Feedback" ? (
          <>
            <textarea placeholder="Feedback" required />
            <div className={styles.buttons}>
              <button
                className={`${styles.btn} ${styles.back}`}
                onClick={props.onCancel}>
                Back
              </button>
              <button className={styles.btn} type="submit">
                Submit
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
};

const Questions = (props) => {
  return (
    <div className={styles.formContainer}>
      <h1>General Question</h1>
      <form className={styles.form} onSubmit={props.submitHandler}>
        <input placeholder="Topic" required />
        <textarea placeholder="Question" required />
        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.back}`}
            onClick={props.onCancel}>
            Back
          </button>
          <button className={styles.btn} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

//this whole file is responsible for showcasing the appropriate form, for the chosen reason back in ContactPage. For every reason, a function exists.
