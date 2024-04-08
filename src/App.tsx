import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './screens/authentication/SignIn';
import AppNavigator from './components/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('fidelese.token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error while checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkAuthentication();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      {isLoggedIn ? <AppNavigator /> : <SignInScreen />}
    </AuthProvider>
  );
}
