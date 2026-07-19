import { NavLink, Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Store/user-ctx";
import { readUserData } from "../firebase";

const navItems = [
  { to: "/exchange", label: "Markets" },
  { to: "/wallet", label: "Wallet" },
  { to: "/mentoring", label: "Intelligence" },
  { to: "/contact", label: "Support" },
];

const Navbar = () => {
  const [profileName, setProfileName] = useState("Account");
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    if (!auth.currentUser) {
      setProfileName("Account");
      return undefined;
    }

    readUserData(auth.currentUser).then((userData) => {
      if (active) {
        setProfileName(userData?.fullName?.split(" ")[0] || "Portfolio");
      }
    });

    return () => {
      active = false;
    };
  }, [auth.currentUser]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      <nav className={styles.container} aria-label="Primary navigation">
        <Link to="/" className={styles.brand} aria-label="CryptPulse home">
          <span className={styles.mark} aria-hidden="true">
            <span />
            <span />
          </span>
          <span className={styles.wordmark}>CRYPT<span>PULSE</span></span>
        </Link>

        <button
          className={styles.menuToggle}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div
          id="primary-menu"
          className={`${styles.navPanel} ${menuOpen ? styles.open : ""}`}
        >
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className={styles.accountArea}>
            <span className={styles.network}><i /> Market live</span>
            <NavLink to="/profile" className={styles.accountLink}>
              <span className={styles.avatar}>{profileName.charAt(0).toUpperCase()}</span>
              <span>{profileName}</span>
            </NavLink>
            {auth.isLoggedIn && (
              <button className={styles.logout} type="button" onClick={auth.onLogout}>
                Exit
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
