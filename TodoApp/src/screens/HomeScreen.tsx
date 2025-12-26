import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../navigation/AppStack';
import ListItem from '../components/ListItem';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export type List = {
  id: string;
  title: string;
  tasks: Task[];
};

const HomeScreen = ({ navigation }: Props) => {
  const [lists, setLists] = useState<List[]>([]);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* ---------------- Firestore subscription ---------------- */

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('lists')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const data: List[] = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.title,
              tasks: d.tasks ?? [],
            };
          });
          setLists(data);
        },
        error => {
          console.error('Firestore read error:', error);
        }
      );

    return unsubscribe;
  }, []);

  /* ---------------- Helpers ---------------- */

  const toggleExpand = (id: string) => {
    setExpandedListId(prev => (prev === id ? null : id));
  };

  const toggleTaskDone = async (listId: string, taskId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedTasks = list.tasks.map(task =>
      task.id === taskId
        ? { ...task, done: !task.done }
        : task
    );

    await firestore()
      .collection('lists')
      .doc(listId)
      .update({ tasks: updatedTasks });
  };

  const enterSelectionMode = (id: string) => {
    setSelectionMode(true);
    setSelectedIds(new Set([id]));
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);

      if (next.size === 0) {
        setSelectionMode(false);
      }

      return next;
    });
  };

  const deleteSelected = async () => {
    Alert.alert(
      'Delete Lists',
      `Delete ${selectedIds.size} list(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const batch = firestore().batch();
            selectedIds.forEach(id => {
              batch.delete(
                firestore().collection('lists').doc(id)
              );
            });
            await batch.commit();
            exitSelectionMode();
          },
        },
      ]
    );
  };

  const openMenu = (listId: string) => {
    Alert.alert(
      'Options',
      undefined,
      [
        {
          text: 'Edit',
          onPress: () =>
            navigation.navigate('EditList', { id: listId }),
        },
        {
          text: 'Select',
          onPress: () => enterSelectionMode(listId),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      {/* Add List button — ALWAYS visible */}
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddList')}
      >
        <Text style={styles.addButtonText}>ADD LIST</Text>
      </Pressable>

      {/* Selection bar */}
      {selectionMode && (
        <View style={styles.selectionBar}>
          <Text>{selectedIds.size} selected</Text>
          <Text style={styles.action} onPress={deleteSelected}>
            Delete
          </Text>
          <Text style={styles.action} onPress={exitSelectionMode}>
            Cancel
          </Text>
        </View>
      )}

      {/* Empty state OR list */}
      {lists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No lists yet. Create your first one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              list={item}
              expanded={expandedListId === item.id}
              selected={selectedIds.has(item.id)}
              selectionMode={selectionMode}
              onToggleExpand={() => toggleExpand(item.id)}
              onToggleTask={taskId =>
                toggleTaskDone(item.id, taskId)
              }
              onToggleSelect={() => toggleSelection(item.id)}
              onOpenMenu={() => openMenu(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  action: {
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 16,
  },
});
