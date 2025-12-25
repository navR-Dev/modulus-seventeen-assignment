import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Add Note" onPress={() => navigation.navigate('AddNote')} />
    </View>
  );
};

export default HomeScreen;
