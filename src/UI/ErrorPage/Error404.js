import { Link, useRouteError } from "react-router-dom";
import styles from "./Error404.module.css";

const Error404 = () => {
  const error = useRouteError();
  const isRouteError = Boolean(error);
  return (
    <main className={styles.page}>
      <div className={styles.signal} aria-hidden="true"><span /><span /><span /></div>
      <span className={styles.code}>{isRouteError ? "SYSTEM / RECOVERY" : "404 / OFF GRID"}</span>
      <h1>{isRouteError ? "The workspace hit an unexpected state." : "This market does not exist."}</h1>
      <p>{isRouteError ? "Your account data has not been changed. Return to a stable market view and continue from there." : "The address may have moved, or the asset is no longer tracked at this location."}</p>
      <div className={styles.actions}><Link to="/exchange">Open markets <span>→</span></Link><Link to="/">Return home</Link></div>
    </main>
  );
};

export default Error404;
