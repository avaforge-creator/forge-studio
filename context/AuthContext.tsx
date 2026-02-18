import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  email: string;
  name: string;
  avatar: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Allowed emails with their names
const ALLOWED_USERS: Record<string, string> = {
  'nikanwethr@gmail.com': 'Nikan',
  'babakwethr@gmail.com': 'Babak',
  'hsn_shrf@icloud.com': 'Hossein'
};

const isEmailAllowed = (email: string): boolean => {
  return Object.keys(ALLOWED_USERS).includes(email.toLowerCase());
};

const getUserName = (email: string): string => {
  return ALLOWED_USERS[email.toLowerCase()] || 'User';
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('forge_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify email is still allowed
        if (isEmailAllowed(userData.email)) {
          setUser(userData);
        } else {
          localStorage.removeItem('forge_user');
        }
      } catch {
        localStorage.removeItem('forge_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // Simple auth: just check if email is allowed
    // No password required for simplicity
    const normalizedEmail = email.toLowerCase();
    
    if (!isEmailAllowed(normalizedEmail)) {
      return { success: false, error: 'Email not authorized. Contact Nikan for access.' };
    }

    const userData = {
      email: normalizedEmail,
      name: getUserName(normalizedEmail),
      avatar: ''
    };

    // Save session
    localStorage.setItem('forge_user', JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  };

  const signup = async (email: string, _password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Same as login - just authorize the email
    const normalizedEmail = email.toLowerCase();
    
    if (!isEmailAllowed(normalizedEmail)) {
      return { success: false, error: 'Email not authorized. Contact Nikan for access.' };
    }

    const userData = {
      email: normalizedEmail,
      name: name || getUserName(normalizedEmail),
      avatar: ''
    };

    // Save session
    localStorage.setItem('forge_user', JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('forge_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
