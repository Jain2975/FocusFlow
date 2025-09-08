import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('focusflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('focusflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem('focusflow_user', JSON.stringify(userData));
  };

  const signUp = (userData) => {
    setUser(userData);
    localStorage.setItem('focusflow_user', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('focusflow_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('focusflow_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
