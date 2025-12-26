import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';

export type TaskInput = {
  id: string;
  title: string;
  done: boolean;
};

type Props = {
  initialTitle?: string;
  initialTasks?: TaskInput[];
  submitLabel: string;
  onSubmit: (title: string, tasks: TaskInput[]) => Promise<void>;
};

const ListForm = ({
  initialTitle = '',
  initialTasks = [],
  submitLabel,
  onSubmit,
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [tasks, setTasks] = useState<TaskInput[]>(initialTasks);

  const addTask = () => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: '',
        done: false,
      },
    ]);
  };

  const updateTaskTitle = (id: string, value: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title: value } : task
      )
    );
  };

  const submit = async () => {
    if (!title.trim()) return;

    await onSubmit(
      title.trim(),
      tasks.filter(t => t.title.trim())
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>List Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="List title"
      />

      <Text style={styles.label}>Tasks</Text>

      {tasks.map(task => (
        <TextInput
          key={task.id}
          style={styles.input}
          placeholder="Task title"
          value={task.title}
          onChangeText={text =>
            updateTaskTitle(task.id, text)
          }
        />
      ))}

      <Button title="Add Task" onPress={addTask} />
      <View style={{ height: 16 }} />
      <Button title={submitLabel} onPress={submit} />
    </View>
  );
};

export default ListForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
});
