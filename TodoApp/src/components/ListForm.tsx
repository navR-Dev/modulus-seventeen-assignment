import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';

export type TaskInput = {
  id: string;
  title: string;
  description: string;
  dueDate: number | null;
  dueDateText: string;
  priority: 'low' | 'medium' | 'high';
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
  const [tasks, setTasks] = useState<TaskInput[]>(
    initialTasks.map(t => ({
      ...t,
      dueDateText: t.dueDate
        ? new Date(t.dueDate).toISOString().slice(0, 10)
        : '',
    }))
  );

  const addTask = () => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        dueDate: null,
        dueDateText: '',
        priority: 'medium',
        done: false,
      },
    ]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTaskField = <K extends keyof TaskInput>(
    id: string,
    field: K,
    value: TaskInput[K]
  ) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const submit = async () => {
    if (!title.trim()) return;

    const cleanedTasks = tasks
      .filter(t => t.title.trim())
      .map(t => {
        let dueDate: number | null = null;

        if (t.dueDateText) {
          const parsed = Date.parse(t.dueDateText);
          if (!isNaN(parsed)) {
            dueDate = parsed;
          }
        }

        return {
          ...t,
          dueDate,
        };
      });

    await onSubmit(title.trim(), cleanedTasks);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>List Title</Text>
        <TextInput
          style={styles.input}
          placeholder="List title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Tasks</Text>

        {tasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskLabel}>Task</Text>
              <Text
                style={styles.remove}
                onPress={() => removeTask(task.id)}
              >
                Remove
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Task name"
              value={task.title}
              onChangeText={text =>
                updateTaskField(task.id, 'title', text)
              }
            />

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Description (optional)"
              multiline
              value={task.description}
              onChangeText={text =>
                updateTaskField(task.id, 'description', text)
              }
            />

            <Text style={styles.subLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high'] as const).map(p => (
                <Text
                  key={p}
                  style={[
                    styles.priority,
                    task.priority === p &&
                      styles.prioritySelected,
                  ]}
                  onPress={() =>
                    updateTaskField(task.id, 'priority', p)
                  }
                >
                  {p.toUpperCase()}
                </Text>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Due date (YYYY-MM-DD)"
              value={task.dueDateText}
              onChangeText={text =>
                updateTaskField(task.id, 'dueDateText', text)
              }
            />
          </View>
        ))}

        <Button title="Add Task" onPress={addTask} />
        <View style={{ height: 16 }} />
        <Button title={submitLabel} onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ListForm;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  multiline: {
    height: 60,
    textAlignVertical: 'top',
  },
  taskCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taskLabel: {
    fontWeight: 'bold',
  },
  remove: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  priority: {
    marginRight: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
  },
  prioritySelected: {
    backgroundColor: '#2196F3',
    color: '#fff',
    borderColor: '#2196F3',
  },
});
