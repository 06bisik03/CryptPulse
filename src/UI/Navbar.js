import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Store/user-ctx";
import { readUserData } from "../firebase";

const Navbar = (props) => {
  const [prof, setProf] = useState("Profile");
  const userLog = localStorage.getItem("userLogged");
  const authctx = useContext(AuthContext);
  //if the user is signed in, set the name that will appear on the navbar to the users full name from firebase. If not, set it to 'Profile'.
  useEffect(() => {
    if (localStorage.getItem("userLogged") !== null) {
      readUserData(localStorage.getItem("userLogged")).then((userData) => {
        setProf(userData.fullName);
      });
    } else {
      setProf("Profile");
    }
  }, [userLog]);

  return (
    <div className={styles.container}>
      <Link to="/">
        <img alt="x"className={styles.logo} src="/images/finallogo.png" />
      </Link>

      <div className={styles.nav}>
        {authctx.isLoggedIn ? (
          <Link
            className={styles.button}
            onClick={authctx.onLogout}
            to="/profile">
            <i
              className="fa-solid fa-arrow-right-from-bracket"
              style={{ color: "#ffffff" }}></i>
          </Link>
        ) : null}
        <Link to="/profile" className={styles.button}>
          {prof}
        </Link>
        <Link to="/wallet" className={styles.button}>
          Wallet
        </Link>
        <Link to="/exchange" className={styles.button}>
          Exchange
        </Link>
        <Link to="/contact" className={styles.button}>
          Contact
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
//This component is the Navigation bar
