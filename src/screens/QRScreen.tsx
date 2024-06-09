import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Camera, PermissionStatus, CameraType } from 'expo-camera';
import { useCardsEmployee } from '../contexts/CardsEmployee';
import { useAuth } from '../contexts/AuthContext';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { Box, Button, Center, Flex, Icon, VStack, Text, Spinner, Image } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function QRScreen(): JSX.Element {
  const { cards, fetchCards, sendLoyaltyData, sendLoyaltyDataPoints, error } = useCardsEmployee();
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [isQRCodeProcessed, setIsQRCodeProcessed] = useState(false);
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (user && user.companyId) {
      fetchCards();
    } else {
      console.warn('User company ID is not available.');
    }

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status);
    })();
  }, [user]);

  const handleQRCodeRead = async ({ type, data }: BarCodeScannerResult) => {
    if (isQRCodeProcessed) return;

    setIsQRCodeProcessed(true);

    try {
      console.log('QR Code Data:', data);
      const qrData = JSON.parse(data as string);
      console.log('Parsed QR Data:', qrData);

      if (!user || !user.companyId) {
        Alert.alert('Erro', 'User ou companyId não está disponível.');
        return;
      }

      if (qrData.cardId && qrData.companyCardId) {
        console.log('Sending loyalty data points:', {
          cardId: qrData.cardId,
          companyCardId: qrData.companyCardId,
          token: qrData.token,
        });

        await sendLoyaltyDataPoints({
          cardId: qrData.cardId,
          companyCardId: cardId as string,
          token: qrData.token,
        });
      } else if (qrData.customerId) {
        console.log('Sending loyalty data:', {
          customerId: qrData.customerId,
          companyCardId: cardId,
          token: qrData.token,
        });

        await sendLoyaltyData({
          customerId: qrData.customerId,
          companyCardId: cardId as string,
          token: qrData.token,
        });
      } else {
        Alert.alert('Erro', 'Dados do QR Code incompletos.');
      }
    } catch (error: any) {
      console.error('Failed to process QR Code:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao processar o QR Code.');
    }
    setIsScannerOpen(false);
    setIsQRCodeProcessed(false);
  };

  if (hasPermission === null) {
    return (
      <Center flex={1} bg="#252525">
        <Spinner color="white" size="lg" />
        <Text color="white" mt={3}>Solicitando permissão da câmera...</Text>
      </Center>
    );
  }

  if (hasPermission !== 'granted') {
    return (
      <Center flex={1} bg="#252525">
        <Text color="white">Acesso à câmera não permitido.</Text>
      </Center>
    );
  }

  const handleOpenScanner = (id: string) => {
    setCardId(id);
    setIsScannerOpen(true);
    setTimeout(() => {
      setShowCamera(true);
    }, 500);
  };

  return (
    <Box flex={1} bg="#252525">
      {isScannerOpen ? (
        showCamera ? (
          <Camera
            style={{ flex: 1 }}
            type={CameraType.back}
            onBarCodeScanned={isScannerOpen ? handleQRCodeRead : undefined}
          >
            <Box flex={1} justifyContent="space-between" alignItems="center">
              <Center mt={12} px={4}>
                <Icon as={MaterialIcons} name="qr-code-scanner" size="4xl" color="white" />
              </Center>
              <Center mb={10} px={4}>
                <Button
                  onPress={() => {
                    setIsScannerOpen(false);
                    setShowCamera(false);
                    setIsQRCodeProcessed(false);
                  }}
                  colorScheme="red"
                  variant="solid"
                  size="lg"
                  rounded="full"
                  _text={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '300px',
                    textAlign: 'center',
                  }}
                >
                  Cancelar
                </Button>
              </Center>
            </Box>
          </Camera>
        ) : (
          <Center flex={1} bg="#252525">
            <Spinner color="white" size="lg" />
            <Text color="white" mt={3}>Inicializando a câmera...</Text>
          </Center>
        )
      ) : (
        <ScrollView contentContainerStyle={{ padding: 40, marginTop: 20 }}>
          {cards.length > 0 ? (
            cards.map((card) => (
              <Box key={card.id} bg="blueGray.700" rounded="lg" shadow={2} mb={4} p={4} alignItems="center">
                <Image
                  source={{ uri: `http://192.168.1.5:3333/${card.image}` }}
                  alt={card.name}
                  width="90%"
                  height={250}
                  rounded="xl"
                  resizeMode="cover"
                />
                <VStack space={3} mt={4} alignItems="left">
                  <Text fontSize="xl" color="white" bold>{card.name}</Text>
                  <Text fontSize="md" color="gray.400">{card.maxPoints} Pontos</Text>
                  <Button
                    onPress={() => handleOpenScanner(card.id)}
                    colorScheme="blue"
                    bg="#2196F3"
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      height: 60,
                      justifyContent: 'center',
                    }}
                  >
                    <Flex direction="row" align="center" justify="center" width="100%">
                      <Icon as={MaterialIcons} name="qr-code-scanner" size="md" color="white" />
                      <Text color="white" fontWeight="medium" ml={2}>
                        LER QRCODE
                      </Text>
                    </Flex>
                  </Button>
                </VStack>
              </Box>
            ))
          ) : (
            <Center flex={1}>
              <Text fontSize="lg" color="white">Nenhum cartão disponível</Text>
            </Center>
          )}
        </ScrollView>
      )}
    </Box>
  );
}
