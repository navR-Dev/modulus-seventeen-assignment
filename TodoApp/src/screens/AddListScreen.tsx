import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';

import { AppStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'AddList'>;

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
};

const AddListScreen = ({ navigation }: Props) => {
  // List state
  const [listTitle, setListTitle] = useState('');

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  // New task input state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskPriority, setTaskPriority] =
    useState<'low' | 'medium' | 'high'>('medium');

  const addTask = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: uuid.v4().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      deadline: taskDeadline || undefined,
      priority: taskPriority,
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);

    // Reset task inputs
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
    setTaskPriority('medium');
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const saveList = () => {
    if (!listTitle.trim() || tasks.length === 0) return;

    const newList = {
      title: listTitle.trim(),
      tasks,
    };

    console.log('New List:', newList);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* List title */}
      <Text style={styles.sectionTitle}>List Title</Text>
      <TextInput
        value={listTitle}
        onChangeText={setListTitle}
        placeholder="e.g. Work, Personal, College"
        style={styles.input}
      />

      {/* Add Task */}
      <Text style={styles.sectionTitle}>Add Task</Text>

      <TextInput
        value={taskTitle}
        onChangeText={setTaskTitle}
        placeholder="Task title"
        style={styles.input}
      />

      <TextInput
        value={taskDescription}
        onChangeText={setTaskDescription}
        placeholder="Task description (optional)"
        style={styles.input}
      />

      <TextInput
        value={taskDeadline}
        onChangeText={setTaskDeadline}
        placeholder="Deadline (e.g. 2025-02-10 18:00)"
        style={styles.input}
      />

      {/* Priority selector */}
      <View style={styles.priorityRow}>
        {(['low', 'medium', 'high'] as const).map(p => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              taskPriority === p && styles.prioritySelected,
            ]}
            onPress={() => setTaskPriority(p)}
          >
            <Text>{p.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Add Task" onPress={addTask} />

      {/* Task list */}
      <Text style={styles.sectionTitle}>Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              {item.deadline && (
                <Text style={styles.taskMeta}>
                  Deadline: {item.deadline}
                </Text>
              )}
              <Text style={styles.taskMeta}>
                Priority: {item.priority}
              </Text>
            </View>

            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={styles.delete}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Save List"
        onPress={saveList}
        disabled={!listTitle || tasks.length === 0}
      />
    </View>
  );
};

export default AddListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priorityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  prioritySelected: {
    backgroundColor: '#ddd',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskMeta: {
    fontSize: 12,
    color: '#555',
  },
  delete: {
    color: 'red',
    fontSize: 16,
  },
});
