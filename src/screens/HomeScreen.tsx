import React from 'react';
import { SafeAreaView } from 'react-native';
import { Center, Text, Box, VStack, HStack, Icon, Divider } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen(): JSX.Element {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#252525' }}>
      <Box flex={1} bg="#252525">
        <HStack bg="black" w="100%" p={4} justifyContent="center" alignItems="center" mt={10}>
          <Icon as={MaterialIcons} name="person" size="lg" color="white" />
          <Text color="white" fontSize="lg" bold ml={4}>
            {user?.name}
          </Text>
        </HStack>
        <Center flex={1} px={4}>
          <VStack space={4} alignItems="center">
            <Text color="white" fontSize="4xl" bold>
              BEM VINDO!
            </Text>
            <Text color="gray.300" fontSize="md" textAlign="center">
              Estamos felizes em tê-lo de volta. Vamos fazer um ótimo trabalho juntos!
            </Text>
            <Divider my={6} bg="gray.500" width="90%" />
          </VStack>
        </Center>
        <Box bg="gray.900" p={3} alignItems="center">
          <Text color="gray.400" fontSize="sm">
            © 2024 Fidele-se. Todos os direitos reservados.
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
