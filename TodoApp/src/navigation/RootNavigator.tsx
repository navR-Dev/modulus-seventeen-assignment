import React, { useState } from 'react';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
