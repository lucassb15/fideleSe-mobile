import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Actionsheet, useDisclose, Center, Box, Text, VStack, HStack, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import QRScreen from '../screens/QRScreen';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Home: undefined;
  QRCode: undefined;
};

const Tab = createBottomTabNavigator();

const EmptyScreen = () => null;

const AppNavigator: React.FC = () => {
  const { signOut } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();

  const logoutHandler = () => {
    onOpen();
  };

  const handleLogout = () => {
    onClose();
    signOut();
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
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopWidth: 0,
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="QRCode"
          component={QRScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Logout"
          component={EmptyScreen}
          options={{ tabBarLabel: 'Logout' }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              logoutHandler();
            },
          }}
        />
      </Tab.Navigator>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="20" fontWeight={'bold'} color="black" _dark={{ color: "gray.300" }}>
              Sair
            </Text>
          </Box>
          <Box w="100%" px={4} justifyContent="center">
            <Text fontSize="16" color="gray.800" _dark={{ color: "gray.300" }}>
              Tem certeza que deseja sair?
            </Text>
          </Box>
          <Box w="100%" px={4} justifyContent="center" alignItems="center" mt={5} mb={5}>
            <Button onPress={handleLogout} w="90%" mb={2} colorScheme="blue" borderRadius={10}>
              SIM
            </Button>
            <Button onPress={onClose} w="90%" variant="outline" borderColor={'#2196F3'} colorScheme="blue" borderRadius={10}>
              NÃO
            </Button>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </NavigationContainer>
  );
};

export default AppNavigator;
