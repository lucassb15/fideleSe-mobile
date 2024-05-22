import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, PermissionStatus, CameraType } from 'expo-camera';
import { useCardsEmployee } from '../contexts/CardsEmployee';
import { useAuth } from '../contexts/AuthContext';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { API_URL } from '@env';

export default function QRScreen(): JSX.Element {
  const { cards, fetchCards, sendLoyaltyData, sendLoyaltyDataPoints, error } = useCardsEmployee();
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  cardId as string
  const [isQRCodeProcessed, setIsQRCodeProcessed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Verifica se o usuário está disponível e se possui um companyId antes de buscar os cartões
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

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.errorText}>Erro: {error}</Text>
  //     </View>
  //   );
  // }

  const handleQRCodeRead = async ({ type, data }: BarCodeScannerResult) => {
    if (isQRCodeProcessed) return; // Se já processado, saia

    setIsQRCodeProcessed(true); // Marque como processado

    try {
      console.log('QR Code Data:', data);
      const qrData = JSON.parse(data as string);
      console.log('Parsed QR Data:', qrData);

      if (!user || !user.companyId) {
        Alert.alert('Erro', 'User ou companyId não está disponível.');
        return;
      }

      let responseMessage = '';

      if (qrData.cardId && qrData.companyCardId) {
        // Chama sendLoyaltyDataPoints se o QR Code contém cardId e companyCardId
        await sendLoyaltyDataPoints({
          cardId: qrData.cardId,
          companyCardId: cardId as string,
          token: qrData.token,
        });
      } else if (qrData.customerId) {
        // Chama sendLoyaltyData se o QR Code contém customerId
        await sendLoyaltyData({
          customerId: qrData.customerId,
          companyCardId: cardId as string,
          token: qrData.token,
        });
      } else {
        responseMessage = 'Dados do QR Code incompletos';
      }

    } catch (error: any) {
      console.error('Failed to process QR Code:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao processar o QR Code.');
    }
    setIsScannerOpen(false);
    setIsQRCodeProcessed(false);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permissão da câmera...</Text></View>;
  }

  if (hasPermission !== 'granted') {
    return <View style={styles.container}><Text>Acesso à câmera não permitido.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {isScannerOpen ? (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          onBarCodeScanned={isScannerOpen ? handleQRCodeRead : undefined}
        >
          <Text style={styles.centerText}>Aponte a câmera para o QR Code</Text>
        </Camera>
      ) : (
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          {cards.length > 0 ? (
            cards.map((card) => (
              <View key={card.id} style={styles.card}>
                <Image
                  style={styles.cardImage}
                  source={{ uri: `http://${API_URL}/${card.image}` }} // Certifique-se de que API_URL está definido corretamente
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.name}</Text>
                  <Text style={styles.cardPoints}>{card.maxPoints} Points</Text>
                  <TouchableOpacity onPress={() => { setIsScannerOpen(true); setCardId(card.id);}} style={styles.qrButton}>
                    <Text style={styles.qrButtonText}>Ler QR Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCardsText}>Nenhum cartão disponível</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#333333',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    maxWidth: 350,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardPoints: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5fa8d3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: '50%',
  },
  qrButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  noCardsText: {
    color: '#fff',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  centerText: {
    fontSize: 18,
    color: 'white',
  },
});
