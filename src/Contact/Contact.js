
import ContactPage from "./ContactPage";

import { useEffect, useState } from "react";
import {  useNavigate } from "react-router";
const Contact = () => {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(null);
  const localSt = localStorage.getItem("isLoggedIn");
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== null) {
      setLogged(<ContactPage />);
    } else {
      return navigate("/profile");
    }
  }, [localSt,navigate]);
  return logged;
};
export default Contact;
//this component is responsible for showing the contactpage if logged in and leading to the log in pannel if not