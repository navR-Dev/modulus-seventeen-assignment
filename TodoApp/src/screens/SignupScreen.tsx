import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen = ({ navigation }: Props) => {
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      await signup(email.trim(), password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={loading ? 'Signing up...' : 'Signup'}
        onPress={handleSignup}
        disabled={loading}
      />

      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 12,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
