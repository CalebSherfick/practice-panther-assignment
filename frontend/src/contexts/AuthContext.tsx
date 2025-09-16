import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, SignupRequest, User } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  signup: (request: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app startup - check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Auth check failed:", error);
          authService.logout();
          // Added setUser(null) to ensure user state is cleared on failure
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (request: LoginRequest) => {
    const { user: userData } = await authService.login(request);
    setUser(userData);
  };

  const signup = async (request: SignupRequest) => {
    const { user: userData } = await authService.signup(request);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
