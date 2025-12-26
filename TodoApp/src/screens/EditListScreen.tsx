import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { AppStackParamList } from '../navigation/AppStack';
import ListForm, { TaskInput } from '../components/ListForm';

type Props = NativeStackScreenProps<AppStackParamList, 'EditList'>;

const EditListScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;

  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      const doc = await firestore()
        .collection('lists')
        .doc(id)
        .get();

      if (doc.exists()) {
        const data = doc.data();
        setTitle(data?.title ?? '');
        setTasks(data?.tasks ?? []);
      }

      setLoading(false);
    };

    fetchList();
  }, [id]);

  const saveChanges = async (
    newTitle: string,
    newTasks: TaskInput[]
  ) => {
    await firestore()
      .collection('lists')
      .doc(id)
      .update({
        title: newTitle,
        tasks: newTasks,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    navigation.goBack();
  };

  if (loading) {
    return <Text style={{ padding: 16 }}>Loading…</Text>;
  }

  return (
    <ListForm
      initialTitle={title}
      initialTasks={tasks}
      submitLabel="Save Changes"
      onSubmit={saveChanges}
    />
  );
};

export default EditListScreen;
