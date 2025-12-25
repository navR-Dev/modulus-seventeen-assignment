import React from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
