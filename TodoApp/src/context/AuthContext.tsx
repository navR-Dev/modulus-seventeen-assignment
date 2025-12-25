import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth from '@react-native-firebase/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore auth state on app start
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signup = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
