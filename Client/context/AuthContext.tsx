import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '../constants/storageKeys';

type User = {
  userId: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (storedToken) {
          setToken(storedToken);

          const decoded: any = jwtDecode(storedToken);
          const userId = decoded.userId;
          const email = decoded.sub;
          const username = decoded.username ?? '';

          setUser({ userId, username, email });
          console.log('✅ User loaded from token decode:', { userId, username, email });
        }
      } catch (err) {
        console.error('❌ Load auth error:', err);
      }
    };
    loadAuthData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.EMAIL,
      ]);
      setUser(null);
      setToken(null);
      console.log('✅ Logged out');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  const value = useMemo(
    () => ({ user, token, setUser, setToken, logout }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within AuthProvider');
  return context;
};
