import React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Create a context for managing authentication-related state and functions.
const AuthContext = React.createContext({
  isLoggedIn: false,
  currentUser: null,
  authReady: false,
  onLogout: () => {},
  onLogin: () => {},
  signUp: () => {},
});
// Component that provides the authentication context to its children.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("isLoggedIn", "1");
        localStorage.setItem("userLogged", user.uid);
        setIsLoggedIn(true);
        setCurrentUser(user.uid);
      } else {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userLogged");
        setIsLoggedIn(false);
        setCurrentUser(null);
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginHandler = (userID) => {
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("userLogged", `${userID}`);
    setIsLoggedIn(true);
    setCurrentUser(userID);
  };

  const logoutHandler = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userLogged");
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        authReady: authReady,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
//This component is responsible for the user authentication functions. Signing in, signing out, etc. These have to be stored in local Storage and so this context, helps us with managing the localStorage user details that is signed in.
