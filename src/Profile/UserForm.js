import { useSearchParams } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import styles from "./UserForm.module.css";

const UserForm = () => {
  const [searchParams] = useSearchParams();
  const isLogin =
    searchParams.get("mode") === "signin"
      ? true
      : searchParams.get("mode") === null
      ? true
      : false;

  return (
    <div className={styles.container}>{isLogin ? <Login /> : <SignUp />}</div>
  );
};
export default UserForm;
