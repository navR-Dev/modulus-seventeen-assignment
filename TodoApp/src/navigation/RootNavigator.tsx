import React from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../context/AuthContext';

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
