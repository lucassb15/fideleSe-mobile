import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
]);

import React from 'react';
import { AppRegistry } from 'react-native';
import { NativeBaseProvider, ToastProvider } from 'native-base';
import AuthLayout from './components/AuthLayout';
import { AuthProvider } from './contexts/AuthContext';
import { CardsEmployeeProvider } from './contexts/CardsEmployee';
import appConfig from '../app.json';

const appName = appConfig.expo.name;

export default function App() {
  console.log("App component is running");

  return (
    <NativeBaseProvider>
      <ToastProvider>
        <AuthProvider>
          <CardsEmployeeProvider>
            <AuthLayout />
          </CardsEmployeeProvider>
        </AuthProvider>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
