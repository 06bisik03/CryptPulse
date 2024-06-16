
import styles from "./UserForm.module.css";
import { useContext } from "react";
import AuthUser from "./AuthUser";
import Navbar from "../UI/Navbar";
import AuthContext from "../Store/user-ctx";
import UserProfile from "./UserProfile";
import LoginPage from "./LoginPage";
const UserForm = () => {
  const authctx = useContext(AuthContext);
  return (
    <div className={styles.container}>
      <AuthUser />

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