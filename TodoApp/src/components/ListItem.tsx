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

  const DAY = 1000 * 60 * 60 * 24;

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
        styles.card,
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
            {completed} of {total} completed
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
            let badge: string | null = null;
            let badgeStyle = null;
            let dateStyle = null;

            if (task.dueDate && !task.done) {
              const daysUntilDue = Math.floor(
                (task.dueDate - today) / DAY
              );

              if (daysUntilDue < 0) {
                badge = 'OVERDUE';
                badgeStyle = styles.overdue;
                dateStyle = styles.overdueText;
              } else if (daysUntilDue === 0) {
                badge = 'TODAY';
                badgeStyle = styles.today;
                dateStyle = styles.todayText;
              } else if (daysUntilDue === 1) {
                badge = 'TOMORROW';
                badgeStyle = styles.tomorrow;
                dateStyle = styles.tomorrowText;
              } else if (daysUntilDue <= 5) {
                badge = 'SOON';
                badgeStyle = styles.soon;
                dateStyle = styles.soonText;
              }
            }

            return (
              <Pressable
                key={task.id}
                style={styles.taskRow}
                onPress={() => onToggleTask(task.id)}
              >
                <View style={styles.checkbox}>
                  {task.done && <View style={styles.checkboxInner} />}
                </View>

                <View style={styles.taskContent}>
                  <View style={styles.taskHeader}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.done && styles.taskDone,
                      ]}
                    >
                      {task.title}
                    </Text>

                    {badge && (
                      <Text style={badgeStyle}>
                        {badge}
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
                        dateStyle,
                      ]}
                    >
                      Due {new Date(task.dueDate)
                        .toISOString()
                        .slice(0, 10)}
                    </Text>
                  ) : null}
                </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selected: {
    backgroundColor: '#e3f2fd',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  menu: {
    fontSize: 20,
    paddingHorizontal: 8,
  },

  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },

  tasks: {
    marginTop: 14,
  },

  taskRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4caf50',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#4caf50',
  },

  taskContent: {
    flex: 1,
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },

  taskDescription: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

  taskDue: {
    fontSize: 12,
    marginTop: 2,
  },

  overdue: {
    color: '#d32f2f',
    fontWeight: '700',
    fontSize: 11,
  },
  today: {
    color: '#e53935',
    fontWeight: '700',
    fontSize: 11,
  },
  tomorrow: {
    color: '#fb8c00',
    fontWeight: '700',
    fontSize: 11,
  },
  soon: {
    color: '#fbc02d',
    fontWeight: '700',
    fontSize: 11,
  },

  overdueText: { color: '#d32f2f' },
  todayText: { color: '#e53935' },
  tomorrowText: { color: '#fb8c00' },
  soonText: { color: '#fbc02d' },
});
