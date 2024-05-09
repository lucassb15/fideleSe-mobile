import React from 'react'
import {  StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen(): JSX.Element {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={{ color: '#fff' }}>FIDELE-SE MOBILE</Text>
      <Text style={{ color: '#fff' }}>Bem vindo { user?.name }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
