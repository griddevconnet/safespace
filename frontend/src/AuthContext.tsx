import React, { createContext, useState, useEffect, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  username: string | null;
  partnerId: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string, username: string, partnerId?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [partnerId, setPartnerId] = useState<string | null>(localStorage.getItem('partnerId'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && userId && username) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token, userId, username]);

  const login = (newToken: string, newUserId: string, newUsername: string, newPartnerId?: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('username', newUsername);
    if (newPartnerId) {
      localStorage.setItem('partnerId', newPartnerId);
    }
    setToken(newToken);
    setUserId(newUserId);
    setUsername(newUsername);
    setPartnerId(newPartnerId || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('partnerId');
    setToken(null);
    setUserId(null);
    setUsername(null);
    setPartnerId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, username, partnerId, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
