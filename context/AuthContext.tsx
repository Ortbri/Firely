// Create an auth conext using firebase on authchange with user object

import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, createContext } from "react";

interface AuthProps {
  user?: User | null;
  initialized: boolean;
}
export const AuthContext = createContext<AuthProps>({
  initialized: false,
});
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>();
  const [initialized, setinitialized] = useState<boolean>(false);

  useEffect(() => {
    console.log("AuthProvider");

    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("Authenticated: ", user && user.email);
      setUser(user);
      setinitialized(true);
    });
  }, []);

  const value = {
    user,
    initialized,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
