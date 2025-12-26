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
import ListActionSheet from '../components/ListActionSheet';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: number | null;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
};

export type List = {
  id: string;
  title: string;
  tasks: Task[];
};

const HomeScreen = ({ navigation }: Props) => {
  const { logout } = useAuth();

  const [lists, setLists] = useState<List[]>([]);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 🔹 Action sheet state
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('lists')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data: List[] = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title,
            tasks: d.tasks ?? [],
          };
        });
        setLists(data);
      });

    return unsubscribe;
  }, []);

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
      if (next.size === 0) setSelectionMode(false);
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

  // 🔹 Action sheet handlers
  const openMenu = (listId: string) => {
    setActiveListId(listId);
    setActionSheetVisible(true);
  };

  const closeSheet = () => {
    setActionSheetVisible(false);
    setActiveListId(null);
  };

  const handleEdit = () => {
    if (!activeListId) return;
    closeSheet();
    navigation.navigate('EditList', { id: activeListId });
  };

  const handleSelect = () => {
    if (!activeListId) return;
    closeSheet();
    enterSelectionMode(activeListId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lists</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

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

      {/* List content */}
      {lists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No lists yet. Tap + to create one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
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

      {/* Floating Add Button */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddList')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Bottom action sheet */}
      <ListActionSheet
        visible={actionSheetVisible}
        onClose={closeSheet}
        onEdit={handleEdit}
        onSelect={handleSelect}
      />
    </View>
  );
};

export default HomeScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 12,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  logout: {
    color: '#d32f2f',
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
  },
});
