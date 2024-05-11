import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthLayout from './components/AuthLayout';
import appConfig from '../app.json';
import { AppRegistry } from 'react-native';
import { CardsEmployeeProvider } from './contexts/CardsEmployee';

const appName = appConfig.expo.name;

export default function App() {
  console.log("App component is running");
  
  return (
    <AuthProvider>
      <CardsEmployeeProvider>
        <AuthLayout />
      </CardsEmployeeProvider>
    </AuthProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
