import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, LoginResponse } from '../services/api';

export interface CustomerUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoggedIn: boolean;
  scannedBatches: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemoConsumer: () => void;
  logout: () => void;
  addScannedBatch: (batchCode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [scannedBatches, setScannedBatches] = useState<string[]>(['PKG-MAHA-042-2697']);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('honeychain_user');
      const savedToken = localStorage.getItem('honeychain_token');
      const savedScans = localStorage.getItem('honeychain_scans');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
      if (savedScans) {
        setScannedBatches(JSON.parse(savedScans));
      }
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res: LoginResponse = await loginUser(email, password);
      const customer: CustomerUser = {
        id: res.user_id,
        name: res.name || 'Verified Consumer',
        email: email,
        role: res.role || 'CONSUMER',
      };
      setUser(customer);
      setToken(res.access_token);
      localStorage.setItem('honeychain_user', JSON.stringify(customer));
      localStorage.setItem('honeychain_token', res.access_token);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Invalid email or password';
      return { success: false, message: errorMsg };
    }
  };

  const loginAsDemoConsumer = () => {
    const demoCustomer: CustomerUser = {
      id: 2,
      name: 'Snehal Rupnavar',
      email: 'consumer@honeychain.in',
      role: 'CONSUMER',
    };
    setUser(demoCustomer);
    setToken('demo-jwt-token-verified-consumer');
    localStorage.setItem('honeychain_user', JSON.stringify(demoCustomer));
    localStorage.setItem('honeychain_token', 'demo-jwt-token-verified-consumer');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('honeychain_user');
    localStorage.removeItem('honeychain_token');
  };

  const addScannedBatch = (batchCode: string) => {
    if (!batchCode) return;
    setScannedBatches((prev) => {
      if (prev.includes(batchCode)) return prev;
      const updated = [batchCode, ...prev];
      localStorage.setItem('honeychain_scans', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        scannedBatches,
        login,
        loginAsDemoConsumer,
        logout,
        addScannedBatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
