import { useState, useEffect } from 'react';
import { Task } from '../types';
import { api } from '../lib/api';

export function useSmartPriority(initialTasks?: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);

  useEffect(() => {
    // Sync state when initialTasks prop changes
    if (initialTasks !== undefined) {
      setTasks(initialTasks);
      return;
    }

    // If no initialTasks provided, fetch from API
    api.getTasks()
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [initialTasks]);

  // Calculate score: Importance * 4 + (6 - Effort) * 2.5 + Complexity * 1.5
  const calculateScore = (task: Task): number => {
    if (task.status === 'completed') return -999;

    const importance = task.importance || 3;
    const complexity = task.complexity || 3;
    const effort = task.effort || 3;

    // High Importance, Low Effort (6 - Effort), Medium Complexity
    const score = (importance * 4) + ((6 - effort) * 2.5) + (complexity * 1.5);

    let dateBonus = 0;
    if (task.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      if (task.dueDate === today) {
        dateBonus = 8;
      } else if (task.dueDate < today) {
        dateBonus = 12; // Overdue tasks are critical!
      }
    }

    const priorityBonus = task.priority === 'high' ? 5 : task.priority === 'medium' ? 2 : 0;

    return score + dateBonus + priorityBonus;
  };

  const getSmartPriorityList = (): Task[] => {
    return [...tasks]
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => calculateScore(b) - calculateScore(a));
  };

  const topPriorityTask = getSmartPriorityList()[0] || null;

  return {
    topPriorityTask,
    getSmartPriorityList,
    calculateScore,
    refreshTasks: async () => {
      const data = await api.getTasks();
      setTasks(data);
    }
  };
}
