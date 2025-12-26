import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../navigation/AppStack';
import ListForm, { TaskInput } from '../components/ListForm';

type Props = NativeStackScreenProps<AppStackParamList, 'EditList'>;

const EditListScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<TaskInput[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const doc = await firestore()
          .collection('lists')
          .doc(id)
          .get();

        if (!doc.exists) {
          Alert.alert('Error', 'List not found');
          navigation.goBack();
          return;
        }

        const data = doc.data();
        setTitle(data?.title ?? '');
        setTasks(data?.tasks ?? []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load list');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id, navigation]);

  const saveChanges = async (
    updatedTitle: string,
    updatedTasks: TaskInput[]
  ) => {
    try {
      await firestore()
        .collection('lists')
        .doc(id)
        .update({
          title: updatedTitle,
          tasks: updatedTasks,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ListForm
      initialTitle={title}
      initialTasks={tasks}
      submitLabel="Save"
      onSubmit={saveChanges}
    />
  );
};

export default EditListScreen;
