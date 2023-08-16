import React from "react";
import { useEffect, useState } from "react";

// Create a context for managing authentication-related state and functions.
const AuthContext = React.createContext({
  isLoggedIn: false,
  currentUser: null,
  onLogout: () => {},
  onLogin: () => {},
  signUp: () => {},
});
// Component that provides the authentication context to its children.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  // Check local storage for user login status when the component mounts.
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn === "1") {
      setIsLoggedIn(true);
      setCurrentUser(localStorage.getItem("userLogged"));
    }
  }, []);

  const loginHandler = (userID) => {
    if (
      localStorage.getItem("isLoggedIn") === "1" &&
      localStorage.getItem("userLogged")
    ) {
      localStorage.setItem("userLogged", userID);
      setIsLoggedIn(true);
    }
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("userLogged", `${userID}`);
    setIsLoggedIn(true);
  };
  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userLogged");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
//This component is responsible for the user authentication functions. Signing in, signing out, etc. These have to be stored in local Storage and so this context, helps us with managing the localStorage user details that is signed in.
