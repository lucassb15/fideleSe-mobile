import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignInScreen from '../screens/authentication/SignIn';
import AppNavigator from '../components/AppNavigator';

const AuthLayout = () => {
  const { user } = useAuth();

  return user ? <AppNavigator /> : <SignInScreen />;
};

export default AuthLayout;
