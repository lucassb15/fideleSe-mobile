import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Box, FormControl, Input,  } from 'native-base';
import PageButton from '../../components/Button';

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

  return (
    <View style={styles.container}>
      <Image
        source={require('./LogoFidelese.png')} // Atualize o caminho da imagem
        style={styles.image}
      />
      <Box alignItems="center" width="100%">
        <FormControl width="100%" maxW="100%">
          <FormControl.Label color={'white'}>E-mail</FormControl.Label>
          <Input
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            width="100%"
            color={'white'}
            p='12px'
          />
        </FormControl>
      </Box>
    <Box alignItems="center" width="100%">
        <FormControl width="100%" maxW="100%">
          <FormControl.Label color={'white'}>Senha</FormControl.Label>
          <Input
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            width="100%"
            color={'white'}
            p='12px'
          />
        </FormControl>
      </Box>
      <Box alignItems="center" marginTop={'20px'}>
        <PageButton handle={handleLogin} />
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#303030',
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
  button: {
    color: "red"
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 10,
  },
});

export default LoginScreen;
