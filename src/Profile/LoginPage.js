import styles from "./LoginPage.module.css";
import { useContext, useState } from "react";
import AuthContext from "../Store/user-ctx";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  createDefaultUserFinanceDetails,
  ensureUserRecord,
  writeUserData,
} from "../firebase";
import { useNavigate } from "react-router";

const formatAuthError = (error) => {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "That email address is already in use.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-login-credentials":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect.";
    default:
      return "Authentication failed. Please try again.";
  }
};

const formatDatabaseError = (error) => {
  if (
    error?.code === "PERMISSION_DENIED" ||
    error?.message?.toLowerCase().includes("permission")
  ) {
    return "Account created, but profile setup failed because Firebase Database rules denied access.";
  }

  return "Account created, but profile setup failed.";
};

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

  const userFinance = createDefaultUserFinanceDetails();

  const handleSignUpSubmission = async (event) => {
    event.preventDefault();
    setGotError("");

    if (!fullName.trim() || !signUpEmail.trim() || !signUpPass || !bday) {
      setGotError("Fill in all sign up fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail.trim(),
        signUpPass
      );
      const user = userCredential.user;

      try {
        await writeUserData(
          user.uid,
          userFinance,
          fullName.trim(),
          signUpEmail.trim(),
          bday
        );
      } catch (databaseError) {
        await signOut(auth);
        setGotError(formatDatabaseError(databaseError));
        return;
      }

      //if signed up also log them in right after
      authctx.onLogin(user.uid);
      navigate("/profile");
    } catch (error) {
      setGotError(formatAuthError(error));
    }
  };

  const handleLoginSubmission = async (event) => {
    event.preventDefault();
    setGotError("");

    if (!loginEmail.trim() || !loginPass) {
      setGotError("Enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPass
      );
      const user = userCredential.user;
      await ensureUserRecord(user);
      authctx.onLogin(user.uid);
      navigate("/profile");
    } catch (error) {
      setGotError(formatAuthError(error));
    }
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
              <div style={{ fontSize: "20px", marginTop: "10px", color: "yellow" }}>
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
