import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import QRScreen from '../screens/QRScreen';
import { Ionicons } from '@expo/vector-icons'; 
import  { useAuth } from '../contexts/AuthContext'
import { Alert } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  QRCode: undefined;
};

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

const AppNavigator: React.FC = () => {
  // AuthContext para acessar a função de signOut
  const { signOut } = useAuth();
  const logoutHandler = () => {
    Alert.alert('Logout', 'Deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      { text: 'Sair', onPress: () => signOut() },
    ]);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'QRCode') {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            } else if (route.name === 'Logout') {
              iconName = focused ? 'log-out' : 'log-out-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Remover o header da tela "Home"
        />
        <Tab.Screen
          name="QRCode"
          component={QRScreen}
          options={{ headerShown: false }} // Remover o header da tela "QRCode"
        />
        <Tab.Screen
          name="Logout"
          component={EmptyScreen}
          options={{ tabBarLabel: 'Logout' }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Previne a navegação padrão
              logoutHandler(); // Executa a função de logout
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
