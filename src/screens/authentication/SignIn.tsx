// Importando os módulos necessários
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Função para fazer login na API

// Componente da tela de login
const LoginScreen = () => {
      const { signIn } = useAuth(); // Acesse signIn usando o hook useAuth

  // Definindo os estados para os campos de e-mail e senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com o envio do formulário de login
// Função para lidar com o envio do formulário de login
const handleLogin = async () => {
  try {
    if (!email.trim()) {
      alert('Por favor, insira um e-mail.');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Chama signIn e espera por um usuário se bem-sucedido
    const user = await signIn(email, password);
    if (user) {
      // Login foi bem-sucedido. Aqui você pode navegar para outra tela ou atualizar o estado.
      console.log('Login bem-sucedido:', user);
      // Por exemplo, navegar para a tela principal ou atualizar o estado de autenticação.
    } else {
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
  }
};



  // Renderizando a tela de login
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

// Exportando o componente da tela de login
export default LoginScreen;
