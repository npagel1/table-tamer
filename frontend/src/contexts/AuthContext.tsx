import { useLocalStorage } from "@mantine/hooks";
import { createContext, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router";
import { CustomerType, StaffType } from "../PageLayout";

export const AuthContext = createContext<any>({});
const AuthContextProvider = AuthContext.Provider;

/**
 * Content of Auth Provider
 * Gives the app access to the propers in the "value" object of return statement
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [storedUser, setStoredUser] = useLocalStorage<string | null>({
    key: 'activeUser',
    defaultValue: null,
  });
  
  const activeUser = useMemo(() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, [storedUser]);

  const isLoggedIn = Boolean(activeUser);

  function login(userParam: CustomerType | StaffType) {
    setStoredUser(JSON.stringify(userParam));
  };

  function logout() {
    setStoredUser(null);
    navigate("/login");
  };

  return (
    <AuthContextProvider value={{ activeUser, isLoggedIn, login, logout }}>
      <>{children}</>
    </AuthContextProvider>
  )
}