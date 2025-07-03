import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

type User = {
  userId: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from AsyncStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
        const email = await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);

        if (userId && username && email) {
          setUser({ userId, username, email });
          console.log('✅ User loaded from storage:', { userId, username, email });
        }
      } catch (err) {
        console.error('❌ Lỗi load user:', err);
      }
    };

    loadUser();
  }, []);

  // ✅ Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        'userId',
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.EMAIL,
        STORAGE_KEYS.DISPLAY_NAME,
        STORAGE_KEYS.BIRTH_DATE,
        STORAGE_KEYS.GENDER,
      ]);
      setUser(null);
      console.log('✅ Logged out');
    } catch (err) {
      console.error('❌ Lỗi logout:', err);
    }
  };

  // ✅ useMemo để tránh recreate value mỗi render
  const value = useMemo(() => ({ user, setUser, logout }), [user]);

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
