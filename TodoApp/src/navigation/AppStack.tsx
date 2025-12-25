import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddNoteScreen from '../screens/AddListScreen';

export type AppStackParamList = {
    Home: undefined;
    AddList: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'My Notes' }}
        />
        <Stack.Screen
          name="AddList"
          component={AddNoteScreen}
          options={{ title: 'Add ToDo List' }}
        />
      </Stack.Navigator>
    );
};
  
export default AppStack;
  