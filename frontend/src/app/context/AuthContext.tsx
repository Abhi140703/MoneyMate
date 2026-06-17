import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = (token: string) => {
    localStorage.setItem(
      "token",
      token
    );

    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};