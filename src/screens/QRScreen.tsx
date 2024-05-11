import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, PermissionStatus, CameraType } from 'expo-camera';
import { useCardsEmployee } from '../contexts/CardsEmployee';
import { useAuth } from '../contexts/AuthContext';
import { BarCodeScannerResult } from 'expo-barcode-scanner';

export default function QRScreen(): JSX.Element {
  const { cards, fetchCards, error } = useCardsEmployee();
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCards();
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status);
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  const handleQRCodeRead = ({ type, data }: BarCodeScannerResult) => {
    Alert.alert('QR Code lido', `Tipo: ${type}, Dados: ${data}`);
    setIsScannerOpen(false);
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
          type={CameraType.back} // Usando CameraType.back diretamente
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
                  source={{ uri: `https://picsum.photos/200` }} // Substitua esta URL pela URL real da imagem se necessário
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.name}</Text>
                  <Text style={styles.cardPoints}>{card.maxPoints} Points</Text>
                  <TouchableOpacity onPress={() => setIsScannerOpen(true)} style={styles.qrButton}>
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
