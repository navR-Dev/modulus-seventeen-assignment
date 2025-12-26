import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { List } from '../screens/HomeScreen';

type Props = {
  list: List;
  expanded: boolean;
  selected: boolean;
  selectionMode: boolean;
  onToggleExpand: () => void;
  onToggleTask: (taskId: string) => void;
  onToggleSelect: () => void;
  onOpenMenu: () => void;
};

const ListItem = ({
  list,
  expanded,
  selected,
  selectionMode,
  onToggleExpand,
  onToggleTask,
  onToggleSelect,
  onOpenMenu,
}: Props) => {
  return (
    <View style={[styles.card, selected && styles.selected]}>
      {/* Header */}
      <Pressable
        style={styles.header}
        onPress={selectionMode ? onToggleSelect : onToggleExpand}
      >
        <Text style={styles.title}>{list.title}</Text>
        <Text onPress={onOpenMenu} style={styles.menu}>⋮</Text>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.tasks}>
          {list.tasks.length === 0 && (
            <Text style={styles.empty}>No tasks</Text>
          )}

          {list.tasks.map(task => (
            <Pressable
              key={task.id}
              onPress={() => onToggleTask(task.id)}
            >
              <Text style={task.done && styles.done}>
                ☐ {task.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
    padding: 8,
  },
  selected: {
    backgroundColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  menu: {
    fontSize: 18,
  },
  tasks: {
    marginTop: 8,
  },
  empty: {
    fontStyle: 'italic',
    color: '#777',
  },
  done: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
});
