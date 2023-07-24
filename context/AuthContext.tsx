// Create an auth conext using firebase on authchange with user object

import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import React, {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
} from "react";
import { useSegments, useRouter } from "expo-router";

interface AuthProps {
  user?: User | null;
  initialized: boolean;
}
export const AuthContext = createContext<AuthProps>({
  initialized: false,
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>();
  const [initialized, setInitialized] = useState<boolean>(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setInitialized(true);
    });
  }, []);

  const useProtectedRoute = () => {
    useEffect(() => {
      const inTabsGroup = segments[0] === "(tabs)";

      if (!user && inTabsGroup) {
        router.replace("/(auth)/login");
      } else if (user && !inTabsGroup) {
        router.replace("/(tabs)/home");
      }
    }, [user, segments]);
  };

  useProtectedRoute();

  const value = {
    user,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
