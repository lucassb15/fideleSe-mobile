import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getAPIClient } from '../api/axios';

// Definição dos tipos para os dados de cartões e erros
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
  error: string | null;
}

// Contexto inicializado com valores padrão
const CardsEmployeeContext = createContext<CardsEmployeeContextData>({
  cards: [],
  fetchCards: () => {},
  error: null,
});

// Provider
const CardsEmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

//   Função para buscar cartões
const fetchCards = async () => {
  if (!user?.companyId) {
    console.log("User company ID is not available.");
    return;
  }
    try {
    const api = await getAPIClient();
    const response = await api.get(`/cards/${user.companyId}`);
    setCards(response.data);
  } catch (error: any) {
    console.error("Failed to fetch cards:", error);
    setError(error.response?.data.message || "Erro desconhecido");
  }
};

// const fetchCards = async () => {
//     console.log("Fetching cards with mock data...");
//   // Usando dados mockados para teste
//     setCards([
//     { id: '663ed58d85ef0e1fec3c09ba', companyId: '663d23a1987bbfd1e94b00ea', name: 'Test', maxPoints: 10, image: 'uploads/6578309e985ce07f7ceaf955/1713917931732promo1_cacaushow.png' }
//     ]);
//     console.log("Cards set:", cards);
//   setError(null); // Resetando erros anteriores se houver
// };

  // Efeito para carregar os cartões inicialmente
    useEffect(() => {
    console.log("Cards set:", cards);
    }, [cards]);  // Este useEffect logará as mudanças no estado `cards`

  return (
    <CardsEmployeeContext.Provider value={{ cards, fetchCards, error }}>
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

export { CardsEmployeeProvider, CardsEmployeeContext };
