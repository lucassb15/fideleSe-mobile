import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPIClient } from '../api/axios';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

// Enumeração para definir os tipos de papéis que um usuário pode ter
export enum Roles {
  Owner,
  Employee,
  Customer,
}

// Interface para descrever a estrutura de dados do usuário
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

// Interface para definir os tipos das funções disponíveis no contexto de autenticação
interface AuthContextType {
  user: UserProps | null;
  signIn: (email: string, password: string) => Promise<UserProps | undefined>;
  signOut: () => void;
}

// Criação do contexto de autenticação com valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provedor de autenticação que encapsula a lógica de estado e autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

// useEffect para verificar a validade do token armazenado localmente ao inicializar o componente
useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('fidelese.token');
    const storageTime = await AsyncStorage.getItem('fidelese.token-time');
    const currentTime = new Date().getTime();

    if (token && storageTime && (currentTime - parseInt(storageTime) < 7200000)) { // 7200000 ms = 2 hours
      try {
        const api = await getAPIClient();
        const response = await api.get('/validateToken', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Falha na validação do token:', error);
        await AsyncStorage.removeItem('fidelese.token');
        await AsyncStorage.removeItem('fidelese.token-time');
      }
    } else {
      await AsyncStorage.removeItem('fidelese.token');
      await AsyncStorage.removeItem('fidelese.token-time');
    }
    setIsLoading(false);
  };

  checkToken();
}, []);

  // Função para realizar o login do usuário
  const signIn = async (email: string, password: string) => {
    try {
      const api = await getAPIClient();
      const response = await api.post('/signin', { email, password });
      if (response.status === 200) {
        const currentTime = new Date().getTime().toString();
        await AsyncStorage.setItem('fidelese.token', response.data.accessToken);
        await AsyncStorage.setItem('fidelese.token-time', currentTime);
        setUser(response.data.user); // Atualiza o estado do usuário com os dados do usuário logado
        return response.data.user;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  // Função para realizar o logout do usuário
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('fidelese.token');
      await AsyncStorage.removeItem('fidelese.token-time');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Renderiza um indicador de atividade enquanto o estado de carregamento estiver ativo
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  // Provedor do contexto que passa as funções de signIn e signOut, junto com o usuário atual
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
