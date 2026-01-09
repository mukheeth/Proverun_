import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(undefined);

// Mock user data
const mockUsers = {
  'admin@meddevice.com': {
    id: '1',
    email: 'admin@meddevice.com',
    name: 'Sarah Mitchell',
    role: 'admin',
    title: 'VP of Operations',
    avatar: null,
    permissions: ['all'],
  },
  'sales@meddevice.com': {
    id: '2',
    email: 'sales@meddevice.com',
    name: 'James Chen',
    role: 'sales',
    title: 'Regional Sales Director',
    avatar: null,
    permissions: ['sales', 'clinical', 'reports'],
  },
  'clinical@meddevice.com': {
    id: '3',
    email: 'clinical@meddevice.com',
    name: 'Dr. Emily Roberts',
    role: 'clinical',
    title: 'Clinical Operations Lead',
    avatar: null,
    permissions: ['clinical', 'vac', 'reports'],
  },
  'finance@meddevice.com': {
    id: '4',
    email: 'finance@meddevice.com',
    name: 'Michael Torres',
    role: 'finance',
    title: 'Finance Director',
    avatar: null,
    permissions: ['finance', 'reports'],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (mockUser && password.length >= 4) {
      setUser(mockUser);
      localStorage.setItem('meddevice_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('meddevice_user');
  }, []);

  const checkAuth = useCallback(() => {
    const stored = localStorage.getItem('meddevice_user');
    if (stored) {
      setUser(JSON.parse(stored));
      return true;
    }
    return false;
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        hasPermission,
      }}
    >
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
