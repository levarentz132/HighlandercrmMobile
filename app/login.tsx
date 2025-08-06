import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://crm.highlander.co.id/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success && result.token) {
        await AsyncStorage.setItem('auth_token', result.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        setLoading(false);
        onLogin();
      } else {
        setLoading(false);
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highlander CRM Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <Button title="Login" onPress={handleLogin} color="#6366F1" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#EEF2FF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, color: '#6366F1', textAlign: 'center' },
  input: { backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
});
