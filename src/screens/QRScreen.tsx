import React from 'react'
import {  StyleSheet, Text, View } from 'react-native'



export default function HomeScreen(): JSX.Element {

  return (
    <View style={styles.container}>
          <Text style={{ color: '#fff' }} >QR-CODE</Text>
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
