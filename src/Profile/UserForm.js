
import styles from "./UserForm.module.css";
import { useContext } from "react";
import Navbar from "../UI/Navbar";
import AuthContext from "../Store/user-ctx";
import UserProfile from "./UserProfile";
import LoginPage from "./LoginPage";
import LoadingScreen from "../LoadingScreen";

const UserForm = () => {
  const authctx = useContext(AuthContext);

  if (!authctx.authReady) {
    return (
      <div className={styles.container}>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {authctx.isLoggedIn ? (
        <UserProfile />
      ) : (
        <>
          <Navbar /> <LoginPage />
        </>
      )}
    </div>
  );
};
export default UserForm;
//this component is responsible for showcasing the profile if signed in and the signin pannel if otherwise
