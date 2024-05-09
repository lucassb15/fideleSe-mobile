import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthLayout from './components/AuthLayout';

export default function App() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}