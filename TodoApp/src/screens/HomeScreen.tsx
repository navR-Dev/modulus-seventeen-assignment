import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

type List = {
  id: string;
  title: string;
  taskCount: number;
};

const HomeScreen = ({ navigation }: Props) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('lists')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (!snapshot) {
            setLists([]);
            setLoading(false);
            return;
          }

          const data: List[] = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.title,
              taskCount: Array.isArray(d.tasks) ? d.tasks.length : 0,
            };
          });

          setLists(data);
          setLoading(false);
        },
        error => {
          console.error('Firestore read error:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Add List" onPress={() => navigation.navigate('AddList')} />

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : lists.length === 0 ? (
        <Text style={styles.empty}>No lists yet. Add one!</Text>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.taskCount} tasks</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    marginTop: 16,
    textAlign: 'center',
  },
  empty: {
    marginTop: 16,
    textAlign: 'center',
    color: '#777',
  },
  listItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
});
