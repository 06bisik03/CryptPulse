import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, readUserData } from "../firebase";

const AuthUser = (props) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        readUserData(user.uid);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return null;
};

export default AuthUser;
//this component is a listener to the user that logs in to the app. 