import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactPage from "./ContactPage";
import AuthContext from "../Store/user-ctx";
import LoadingScreen from "../LoadingScreen";

const Contact = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.authReady && !auth.isLoggedIn) navigate("/profile", { replace: true });
  }, [auth.authReady, auth.isLoggedIn, navigate]);

  if (!auth.authReady || !auth.isLoggedIn) return <LoadingScreen label="Opening secure support" />;
  return <ContactPage />;
};

export default Contact;
