import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPIClient } from '../api/axios'; // Importe a função getAPIClient corretamente
import { ReactNode, createContext, useContext, useState } from 'react';

export enum Roles {
  Owner,
  Employee,
  Customer,
}

interface UserProps {
  id: string
  name: string
  email: string
  role: Roles
  companyId?: string
  isEmployee?: boolean
  logo?: FileList
  isActive?: boolean
}

interface AuthContextType {
  user: UserProps | null;
  signIn: (email: string, password: string) => Promise<UserProps | undefined>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      const api = await getAPIClient();
      const response = await api.post('/signin', { email, password });

      if (response.status === 200) {
        await AsyncStorage.setItem('fidelese.token', response.data.accessToken);
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

const signOut = async () => {
  try {
    await AsyncStorage.removeItem('fidelese.token');
    setUser(null);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
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