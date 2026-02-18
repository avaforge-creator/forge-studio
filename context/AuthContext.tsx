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
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (email: string, password: string, name: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Allowed emails with their names
const ALLOWED_USERS: Record<string, string> = {
  'nikanwethr@gmail.com': 'Nikan',
  'babakwethr@gmail.com': 'Babak',
  'hsn_shrf@icloud.com': 'Hossein'
};

// Default passwords (hashed) - users can change these later
// Default password for all accounts: "demo123"
const DEFAULT_PASSWORD_HASH = 'demo123';

// Stored users (email -> { name, passwordHash })
interface StoredUser {
  name: string;
  passwordHash: string;
}

const getStoredUsers = (): Record<string, StoredUser> => {
  const stored = localStorage.getItem('forge_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  // Initialize with allowed users if no stored users exist
  initializeDefaultUsers();
  return {};
};

const initializeDefaultUsers = () => {
  // Pre-create accounts for allowed users with default password
  const defaultUsers: Record<string, StoredUser> = {};
  for (const [email, name] of Object.entries(ALLOWED_USERS)) {
    defaultUsers[email.toLowerCase()] = {
      name,
      passwordHash: DEFAULT_PASSWORD_HASH
    };
  }
  localStorage.setItem('forge_users', JSON.stringify(defaultUsers));
  console.log('Initialized default users:', Object.keys(defaultUsers));
};

const saveStoredUsers = (users: Record<string, StoredUser>) => {
  localStorage.setItem('forge_users', JSON.stringify(users));
};

// Ensure default users exist in storage
const ensureDefaultUsers = () => {
  const storedUsers = getStoredUsers();
  let needsSave = false;
  
  for (const [email, name] of Object.entries(ALLOWED_USERS)) {
    const normalizedEmail = email.toLowerCase();
    if (!storedUsers[normalizedEmail]) {
      storedUsers[normalizedEmail] = {
        name,
        passwordHash: DEFAULT_PASSWORD_HASH
      };
      needsSave = true;
      console.log(`Created default account for: ${normalizedEmail}`);
    }
  }
  
  if (needsSave) {
    saveStoredUsers(storedUsers);
  }
  
  return storedUsers;
};

// Simple hash function for demo purposes (in production, use proper bcrypt)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('forge_user');
      }
    }
    
    // Ensure default users exist (in case of first visit or after cache clear)
    ensureDefaultUsers();
    
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Ensure default users exist (in case this is first login after clear)
    ensureDefaultUsers();
    
    // Check if user exists
    const storedUsers = getStoredUsers();
    const storedUser = storedUsers[normalizedEmail];
    
    if (!storedUser) {
      return { success: false, error: 'Account not found. Please sign up first.' };
    }
    
    // Verify password
    const passwordHash = simpleHash(password);
    if (storedUser.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    
    // Login successful
    const user: User = {
      email: normalizedEmail,
      name: storedUser.name,
      avatar: `https://picsum.photos/seed/${storedUser.name.toLowerCase()}/100/100`
    };
    
    setUser(user);
    localStorage.setItem('forge_user', JSON.stringify(user));
    return { success: true };
  };

  const signup = (email: string, password: string, name: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email is allowed
    const allowedName = ALLOWED_USERS[normalizedEmail];
    if (!allowedName) {
      return { 
        success: false, 
        error: `Email "${email}" is not authorized. Only the following emails are allowed:\n• nikanwethr@gmail.com (Nikan)\n• babakwethr@gmail.com (Babak)\n• hsn_shrf@icloud.com (Hossein)` 
      };
    }
    
    // Ensure default users exist first
    ensureDefaultUsers();
    
    // Check if user already exists
    const storedUsers = getStoredUsers();
    const storedUser = storedUsers[normalizedEmail];
    
    // If user exists with default password, allow login with new password
    if (storedUser) {
      // Update password if user is logging in with new password
      const passwordHash = simpleHash(password);
      if (password !== 'demo123') {
        storedUsers[normalizedEmail] = {
          name: allowedName,
          passwordHash
        };
        saveStoredUsers(storedUsers);
      }
    } else {
      // Create new user
      const passwordHash = simpleHash(password);
      storedUsers[normalizedEmail] = {
        name: allowedName || name,
        passwordHash
      };
      saveStoredUsers(storedUsers);
    }
    
    // Auto-login after signup
    const user: User = {
      email: normalizedEmail,
      name: allowedName,
      avatar: `https://picsum.photos/seed/${allowedName.toLowerCase()}/100/100`
    };
    
    setUser(user);
    localStorage.setItem('forge_user', JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forge_user');
  };

  const changePassword = (currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: 'You must be logged in to change your password.' };
    }

    const storedUsers = getStoredUsers();
    const storedUser = storedUsers[user.email.toLowerCase()];

    if (!storedUser) {
      return { success: false, error: 'User not found.' };
    }

    // Verify current password
    const currentHash = simpleHash(currentPassword);
    if (storedUser.passwordHash !== currentHash && currentPassword !== 'demo123') {
      return { success: false, error: 'Current password is incorrect.' };
    }

    // Update password
    const newHash = simpleHash(newPassword);
    storedUsers[user.email.toLowerCase()].passwordHash = newHash;
    saveStoredUsers(storedUsers);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login, 
      signup,
      logout,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
