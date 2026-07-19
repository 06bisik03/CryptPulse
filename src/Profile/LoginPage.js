import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import styles from "./LoginPage.module.css";
import AuthContext from "../Store/user-ctx";
import { auth, createDefaultUserFinanceDetails, ensureUserRecord, writeUserData } from "../firebase";

const formatAuthError = (error) => {
  switch (error?.code) {
    case "auth/email-already-in-use": return "That email address is already in use.";
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/weak-password": return "Password must be at least 6 characters.";
    case "auth/invalid-login-credentials":
    case "auth/user-not-found":
    case "auth/wrong-password": return "Email or password is incorrect.";
    case "auth/network-request-failed": return "The secure sign-in service is unreachable. Check your connection and try again.";
    case "auth/too-many-requests": return "Too many attempts. Wait briefly before trying again.";
    default: return "Authentication failed. Please try again.";
  }
};

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ name: "", email: "", birthDate: "", password: "" });

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    if (!login.email.trim() || !login.password) return setError("Enter both email and password.");
    setPending(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, login.email.trim(), login.password);
      await ensureUserRecord(credential.user);
      authContext.onLogin(credential.user.uid);
      navigate("/profile");
    } catch (submissionError) {
      setError(formatAuthError(submissionError));
    } finally {
      setPending(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    if (!signup.name.trim() || !signup.email.trim() || !signup.birthDate || !signup.password) {
      return setError("Complete every account field.");
    }
    setPending(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, signup.email.trim(), signup.password);
      try {
        await writeUserData(credential.user.uid, createDefaultUserFinanceDetails(), signup.name.trim(), signup.email.trim(), signup.birthDate);
      } catch {
        await signOut(auth);
        throw new Error("profile-write-failed");
      }
      authContext.onLogin(credential.user.uid);
      navigate("/profile");
    } catch (submissionError) {
      setError(submissionError.message === "profile-write-failed" ? "Your account was created but the portfolio profile could not be initialized. Please try signing in." : formatAuthError(submissionError));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.manifesto}>
        <span className={styles.eyebrow}>Private market workspace</span>
        <h1>Every position.<br /><em>One pulse.</em></h1>
        <p>Sign in to access your wallet, portfolio exposure, transaction history, and secure trading workflow.</p>
        <div className={styles.securityGrid}>
          <div><strong>01</strong><span>Protected authentication</span></div>
          <div><strong>02</strong><span>Persistent portfolio state</span></div>
          <div><strong>03</strong><span>Resilient market snapshots</span></div>
        </div>
        <Link to="/exchange">Browse markets without signing in →</Link>
      </section>

      <section className={styles.panel}>
        <div className={styles.tabs} role="tablist">
          <button type="button" className={mode === "signin" ? styles.active : ""} onClick={() => { setMode("signin"); setError(""); }}>Sign in</button>
          <button type="button" className={mode === "signup" ? styles.active : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
        </div>

        <div className={styles.formHeader}>
          <span>{mode === "signin" ? "Welcome back" : "Join CryptPulse"}</span>
          <h2>{mode === "signin" ? "Access your portfolio" : "Open your market account"}</h2>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <label htmlFor="login-email"><span>Email address</span><input id="login-email" type="email" autoComplete="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} placeholder="name@example.com" /></label>
            <label htmlFor="login-password"><span>Password</span><input id="login-password" type="password" autoComplete="current-password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} placeholder="••••••••" /></label>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <button className={styles.submit} type="submit" disabled={pending}>{pending ? "Securing session…" : "Enter portfolio"}<span>↗</span></button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className={styles.form}>
            <label htmlFor="signup-name"><span>Full name</span><input id="signup-name" type="text" autoComplete="name" value={signup.name} onChange={(event) => setSignup({ ...signup, name: event.target.value })} placeholder="Your name" /></label>
            <label htmlFor="signup-email"><span>Email address</span><input id="signup-email" type="email" autoComplete="email" value={signup.email} onChange={(event) => setSignup({ ...signup, email: event.target.value })} placeholder="name@example.com" /></label>
            <div className={styles.formRow}>
              <label htmlFor="signup-birth"><span>Date of birth</span><input id="signup-birth" type="date" value={signup.birthDate} onChange={(event) => setSignup({ ...signup, birthDate: event.target.value })} /></label>
              <label htmlFor="signup-password"><span>Password</span><input id="signup-password" type="password" minLength="6" autoComplete="new-password" value={signup.password} onChange={(event) => setSignup({ ...signup, password: event.target.value })} placeholder="6+ characters" /></label>
            </div>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <button className={styles.submit} type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}<span>↗</span></button>
          </form>
        )}
        <p className={styles.legal}>By continuing, you acknowledge that digital assets are volatile and that CryptPulse is a simulated portfolio environment.</p>
      </section>
    </main>
  );
};

export default LoginPage;
