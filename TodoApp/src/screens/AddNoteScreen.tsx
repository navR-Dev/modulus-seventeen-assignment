import React from 'react';
import { View, Text, Button } from 'react-native';

const AddNoteScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>Add Note Screen</Text>
      <Button title="Save Note" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default AddNoteScreen;
