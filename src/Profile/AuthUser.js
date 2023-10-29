import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth, readUserData } from "../firebase";

const AuthUser = (props) => {
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        readUserData(user.uid);
      } else {
        console.log('nouser')
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