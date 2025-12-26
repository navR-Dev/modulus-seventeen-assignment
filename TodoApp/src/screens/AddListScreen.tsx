import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../navigation/AppStack';
import ListForm, { TaskInput } from '../components/ListForm';

type Props = NativeStackScreenProps<AppStackParamList, 'AddList'>;

const AddListScreen = ({ navigation }: Props) => {
  const createList = async (title: string, tasks: TaskInput[]) => {
    const user = auth().currentUser;
    if (!user) return;

    await firestore().collection('lists').add({
      title,
      tasks,
      userId: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    navigation.goBack();
  };

  return (
    <ListForm
      submitLabel="Add List"
      onSubmit={createList}
    />
  );
};

export default AddListScreen;
