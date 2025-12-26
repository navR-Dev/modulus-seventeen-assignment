import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: number | null;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
};

type List = {
  id: string;
  title: string;
  tasks: Task[];
};

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
  const completed = list.tasks.filter(t => t.done).length;
  const total = list.tasks.length;
  const progress = total === 0 ? 0 : completed / total;

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const TWO_DAYS = 1000 * 60 * 60 * 48;

  const handlePress = () => {
    if (selectionMode) {
      onToggleSelect();
    } else {
      onToggleExpand();
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        selected && styles.selected,
      ]}
      onPress={handlePress}
      onLongPress={onToggleSelect}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{list.title}</Text>
        <Text style={styles.menu} onPress={onOpenMenu}>
          ⋮
        </Text>
      </View>

      {/* Collapsed */}
      {!expanded && (
        <>
          <Text style={styles.meta}>
            {completed}/{total} tasks
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </>
      )}

      {/* Expanded */}
      {expanded && (
        <View style={styles.tasks}>
          {list.tasks.map(task => {
            const isOverdue =
              task.dueDate !== null &&
              task.dueDate < today &&
              !task.done;

            const isDueSoon =
              task.dueDate !== null &&
              task.dueDate >= today &&
              task.dueDate <= today + TWO_DAYS &&
              !task.done;

            return (
              <Pressable
                key={task.id}
                style={styles.task}
                onPress={() => onToggleTask(task.id)}
              >
                <View style={styles.taskHeader}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.done && styles.taskDone,
                    ]}
                  >
                    {task.title}
                  </Text>

                  {isOverdue && (
                    <Text style={styles.overdue}>
                      OVERDUE
                    </Text>
                  )}

                  {!isOverdue && isDueSoon && (
                    <Text style={styles.dueSoon}>
                      DUE SOON
                    </Text>
                  )}
                </View>

                {task.description ? (
                  <Text style={styles.taskDescription}>
                    {task.description}
                  </Text>
                ) : null}

                {task.dueDate ? (
                  <Text
                    style={[
                      styles.taskDue,
                      isOverdue && styles.overdueText,
                      isDueSoon && styles.dueSoonText,
                    ]}
                  >
                    Due:{' '}
                    {new Date(task.dueDate)
                      .toISOString()
                      .slice(0, 10)}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </Pressable>
  );
};

export default ListItem;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menu: {
    fontSize: 18,
    paddingHorizontal: 6,
  },
  meta: {
    color: '#666',
    marginTop: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  tasks: {
    marginTop: 10,
  },
  task: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskTitle: {
    fontSize: 14,
    flex: 1,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  taskDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  taskDue: {
    fontSize: 12,
    marginTop: 2,
  },
  overdue: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 11,
  },
  dueSoon: {
    color: '#f57c00',
    fontWeight: 'bold',
    fontSize: 11,
  },
  overdueText: {
    color: '#d32f2f',
  },
  dueSoonText: {
    color: '#f57c00',
  },
});
