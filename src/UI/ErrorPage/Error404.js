import LazyLoad from "react-lazy-load";
import styles from "./Error404.module.css";
import { Link } from "react-router-dom";
const Error404 = () => {
  return (
    <div className={styles.oopss}>
      <div className={styles.error}>
        <LazyLoad>
          <img
            src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
            alt="404"
          />
        </LazyLoad>
        <span>404 PAGE</span>
        <p className={styles.pa}>
          I think you might have lost your way. The page does not really exist.
        </p>
        <Link to="/" className={styles.button}>
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};
export default Error404;
//This component is responsible for showing up when the url is non existent.
