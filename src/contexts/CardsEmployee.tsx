import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Toast } from 'native-base';
import { getAPIClient } from '../api/axios';
import { useAuth } from './AuthContext';

interface AxiosError {
  response: {
    data: {
      message: string
    }
  }
}
interface QrCodeData {
  customerId?: string;
  token: string;
  companyCardId: string;
  cardId?: string;
}

interface CardProps {
  id: string;
  companyId: string;
  name: string;
  maxPoints: number;
  image: string;
}

interface CardsEmployeeContextData {
  cards: CardProps[];
  fetchCards: () => void;
  sendLoyaltyData: (data: QrCodeData) => Promise<void>;
  sendLoyaltyDataPoints: (data: QrCodeData) => Promise<void>;
  error: string | null;
}

const CardsEmployeeContext = createContext<CardsEmployeeContextData>({
  cards: [],
  fetchCards: () => {},
  sendLoyaltyData: async () => {},
  sendLoyaltyDataPoints: async () => {},
  error: null,
});

interface CardsProviderProps {
  children: ReactNode;
}

const CardsEmployeeProvider: React.FC<CardsProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCards = async () => {
    if (!user?.companyId) {
      console.log("O ID da empresa do usuário não está disponível.");
      return;
    }
    try {
      const api = await getAPIClient();
      const response = await api.get(`/cards/${user.companyId}`);
      setCards(response.data);
    } catch (error: any) {
      console.error("Falha ao buscar cartões:", error);
      setError(error.response?.data.message || "Erro desconhecido");
    }
  };

 const handleError = (error: any) => {
    const toastOptions = {
      duration: 4000,
      placement: 'top' as 'top',
      status: 'error' as 'error',
      variant: 'subtle' as 'subtle',
      isClosable: true,
      minWidth: '80%',
      style: {
        backgroundColor: '#ff6b6b',
      },
    };

  if (error.response) {
    switch (error.response.status) {
      case 400:
        Toast.show({ description: 'Requisição inválida', ...toastOptions });
        break;
      case 403:
        Toast.show({ description: 'O cartão utilizado não corresponde ao cartão do cliente.', ...toastOptions });
        break;
      case 500:
        Toast.show({ description: 'Erro no servidor', ...toastOptions });
        break;
      default:
        Toast.show({ description: 'Ocorreu um erro desconhecido', ...toastOptions });
    }
  } else {
    Toast.show({ description: 'Falha ao processar o QR Code', ...toastOptions });
  }
};


  const sendLoyaltyData = async (data: QrCodeData) => {
    try {
      const api = await getAPIClient();
      console.log("Enviando dados para criação de cartão de fidelidade:", data);
      const response = await api.post('/create/loyalty', data);
      console.log('Resposta do backend:', response.data);
      Toast.show({ description: 'Cartão fidelidade criado com sucesso!', placement: 'top' });
    } catch (error: any) {
      // console.error("Erro na resposta da API:", error);
      handleError(error);
      // setError((error as AxiosError).response?.data.message || 'Erro ao criar cartão fidelidade');
    }
  };

  const sendLoyaltyDataPoints = async (data: QrCodeData) => {
    try {
      const api = await getAPIClient();
      console.log("Enviando dados para adição de pontos:", data);
      const response = await api.put('/edit/loyalty', data);
      console.log('Resposta do backend:', response.data);
      Toast.show({ description: 'Pontos adicionados com sucesso!', placement: 'top' });
    } catch (error: any) {
      // console.error("Erro na resposta da API:", error);
      handleError(error);
      // setError((error as AxiosError).response?.data.message || 'Erro ao adicionar pontos');
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  return (
    <CardsEmployeeContext.Provider value={{ cards, fetchCards, sendLoyaltyData, sendLoyaltyDataPoints, error }}>
      {children}
    </CardsEmployeeContext.Provider>
  );
};

// Hook customizado para acessar o contexto
export const useCardsEmployee = () => {
  const context = useContext(CardsEmployeeContext);
  if (!context) {
    throw new Error('useCardsEmployee deve ser usado dentro de um CardsEmployeeProvider');
  }
  return context;
};

export { CardsEmployeeContext, CardsEmployeeProvider };
