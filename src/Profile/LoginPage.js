import styles from "./LoginPage.module.css";
import { useContext, useState } from "react";
import AuthContext from "../Store/user-ctx";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { writeUserData } from "../firebase";
import { useNavigate } from "react-router";
const LoginPage = () => {
  const authctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [gotError, setGotError] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [bday, setBday] = useState("");
  const [fullName, setFullName] = useState("");

  const userFinance = {
    coins: [],
    transactions: [],
    money: 0,
    wallet: [],
    totalFlow: 0,
    deposits: 0,
    investments: 0,
  };

  const handleSignUpSubmission = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPass)
      .then((userCredential) => {
        const user = userCredential.user;
        writeUserData(
          user.uid,
          userFinance,
          fullName,
          signUpEmail,
          signUpPass,
          bday
        );
        //if signed up also log them in right after
        authctx.onLogin(user.uid);
        navigate("/profile");
      })
      .catch((error) => {
          setGotError('Error signing up');
      });
  };

  const handleLoginSubmission = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPass)
      .then((userCredential) => {
        const user = userCredential.user;
        authctx.onLogin(user.uid);
     
      })
      .catch((error) => {
        setGotError("Error signing in.");
      });
  };
  return (
    <div className={styles["login-wrap"]}>
      <div className={styles["login-html"]}>
        <input
          id="tab-1"
          type="radio"
          name="tab"
          className={styles["sign-in"]}
          defaultChecked
        />
        <label htmlFor="tab-1" className={styles.tab}>
          Sign In
        </label>
        <input
          id="tab-2"
          type="radio"
          name="tab"
          className={styles["sign-up"]}
        />
        <label htmlFor="tab-2" className={styles.tab}>
          Sign Up
        </label>
        <div className={styles["login-form"]}>
          <form
            className={styles["sign-in-htm"]}
            onSubmit={handleLoginSubmission}>
            <div className={styles.group}>
              <label htmlFor="user" className={styles.label}>
                Email
              </label>
              <input
                id="user-1"
                type="text"
                className={styles.input}
                name="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="pass" className={styles.label}>
                Password
              </label>
              <input
                id="pass-1"
                type="password"
                className={styles.input}
                data-type="password"
                name="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <input type="submit" className={styles.button} value="Sign In" />
            </div>
            {gotError !== "" ? (
              <div style={{ fontSize: "20px", marginTop: "10px", color: 'yellow' }}>
                {gotError}{" "}
              </div>
            ) : null}
          </form>

          <form
            className={styles["sign-up-htm"]}
            onSubmit={handleSignUpSubmission}>
            <div className={styles.group}>
              <label htmlFor="email" className={styles.label}>
                Name/Surname
              </label>
              <input
                id="email"
                type="text"
                className={styles.input}
                autoComplete="off"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="text"
                className={styles.input}
                onChange={(e) => setSignUpEmail(e.target.value)}
                value={signUpEmail}
                autoComplete="off"
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="email" className={styles.label}>
                Date of Birth
              </label>
              <input
                id="email"
                type="date"
                className={styles.input}
                value={bday}
                onChange={(e) => setBday(e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="pass" className={styles.label}>
                Password
              </label>
              <input
                id="pass-2"
                type="password"
                className={styles.input}
                data-type="password"
                onChange={(e) => setSignUpPass(e.target.value)}
                value={signUpPass}
              />
            </div>
            <div className={styles.group}>
              <input type="submit" className={styles.button} value="Sign Up" />
            </div>
            <div className={styles.hr}></div>
            <div className={styles["foot-lnk"]}>
              <label htmlFor="tab-1">Already a Member?</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
//this component is responsible for signing the user in and up while sending the form data to firebase database.