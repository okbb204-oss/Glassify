import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  is_guest?: boolean;
  backup_code?: string;
  phone_number?: string;
  email?: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  referred_by?: string;
  friends_invited?: number;
  referral_processed?: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithUsername: (username: string, password: string, confirmPassword: string) => Promise<void>;
  signInWithUsername: (username: string, password: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Guest Methods
  guestBackupCode: () => Promise<string>;
  guestLinkPhone: (phone: string) => Promise<void>;
  guestRestore: (code?: string, phone?: string) => Promise<void>;
  guestConvert: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const initGuestUser = async () => {
    try {
      const res = await fetch('/api/auth/guest-init', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setUser({
          id: String(data.user.id),
          name: data.user.username,
          username: data.user.username,
          is_guest: true,
          xp: 0,
          streak: 1,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
    } catch(e) {
      console.error('Failed to init guest', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      setUser({
        id: String(data.user.id),
        name: data.user.username,
        username: data.user.username,
        is_guest: !!data.user.is_guest,
        backup_code: data.user.backup_code,
        phone_number: data.user.phone_number,
        xp: 0,
        streak: 1,
        createdAt: new Date(),
        lastLogin: new Date()
      });
    } catch (e) {
      localStorage.removeItem('token');
      await initGuestUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe(token);
    } else {
      initGuestUser();
    }
  }, []);

  const loginOrRegister = async (url: string, body: any) => {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err: any) {
      throw new Error('Network error: Could not connect to the server.');
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned an invalid response.');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    
    localStorage.setItem('token', data.token);
    await fetchMe(data.token);
  };

  const signUpWithUsername = async (username: string, password: string, confirmPassword: string) => {
    await loginOrRegister('/api/auth/register', { username, password, confirmPassword });
  };

  const signInWithUsername = async (username: string, password: string) => {
    await loginOrRegister('/api/auth/login', { username, password });
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    await initGuestUser();
  };

  const guestBackupCode = async () => {
    const res = await fetch('/api/auth/guest-backup-code', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to generate code');
    const data = await res.json();
    setUser(u => u ? { ...u, backup_code: data.backupCode } : null);
    return data.backupCode;
  };

  const guestLinkPhone = async (phone: string) => {
    const res = await fetch('/api/auth/guest-link-phone', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to link phone');
    setUser(u => u ? { ...u, phone_number: phone } : null);
  };

  const guestRestore = async (code?: string, phone?: string) => {
    const res = await fetch('/api/auth/guest-restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restore account');
    localStorage.setItem('token', data.token);
    await fetchMe(data.token);
  };

  const guestConvert = async (username: string, password: string) => {
    const res = await fetch('/api/auth/guest-convert', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to convert account');
    localStorage.setItem('token', data.token);
    await fetchMe(data.token);
  };

  // Stubs for compatibility
  const signInWithGoogle = async () => { console.warn('Google sign-in disabled'); };
  const sendPasswordReset = async (_username: string) => { throw new Error('Not implemented'); };
  const sendVerificationEmail = async () => {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile: user, 
      loading, 
      signInWithGoogle, 
      signUpWithUsername,
      signInWithUsername,
      sendVerificationEmail,
      sendPasswordReset,
      logout,
      guestBackupCode,
      guestLinkPhone,
      guestRestore,
      guestConvert
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
