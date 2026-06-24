import axios from 'axios';
import { authStorage } from './auth';
import { Task, User, WorkloadStatus } from '../types';

// ─── Axios Instance ────────────────────────────────────────────────────────

const http = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Automatically attach Bearer token on every request
http.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 (unauthorized) → clear token and redirect to login
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── API Object ────────────────────────────────────────────────────────────

export const api = {
  // ── Authentication ────────────────────────────────────────────────────

  /**
   * Fetch the currently authenticated user from the server.
   * Returns null if not authenticated.
   */
  getCurrentUser: async (): Promise<User | null> => {
    if (!authStorage.isAuthenticated()) return null;
    try {
      const res = await http.get('/user');
      const localUserStr = localStorage.getItem('nexa_user');
      let localUser = null;
      if (localUserStr) {
        try {
          localUser = JSON.parse(localUserStr);
        } catch {}
      }
      return {
        id: String(res.data.id),
        name: localUser?.name || res.data.name,
        email: res.data.email,
        avatarUrl: localUser?.avatarUrl || (res.data.avatar_url ?? undefined),
      };
    } catch {
      return null;
    }
  },

  /**
   * Login with email + password. Stores the returned token.
   */
  login: async (email: string, password: string): Promise<User> => {
    const res = await http.post('/login', { email, password });
    const { user, token } = res.data;
    authStorage.setToken(token);
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url ?? undefined,
    };
  },

  /**
   * Register a new account. Stores the returned token.
   */
  register: async (name: string, email: string, password: string, passwordConfirmation: string): Promise<User> => {
    const res = await http.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    const { user, token } = res.data;
    authStorage.setToken(token);
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url ?? undefined,
    };
  },

  /**
   * Logout: revoke server token and clear local storage.
   */
  logout: async (): Promise<void> => {
    try {
      await http.post('/logout');
    } finally {
      authStorage.clearToken();
    }
  },

  // ── Tasks API ─────────────────────────────────────────────────────────

  /**
   * Fetch all tasks for the authenticated user.
   */
  getTasks: async (): Promise<Task[]> => {
    const res = await http.get('/tasks');
    return res.data;
  },

  /**
   * Create a new task.
   */
  addTask: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const res = await http.post('/tasks', {
      title:       taskData.title,
      description: taskData.description,
      status:      taskData.status,
      priority:    taskData.priority,
      due_date:    taskData.dueDate ?? null,
      complexity:  taskData.complexity,
      effort:      taskData.effort,
      importance:  taskData.importance,
      subtasks:    taskData.subtasks.map((s) => ({
        id:        s.id.startsWith('temp-') ? undefined : Number(s.id),
        title:     s.title,
        completed: s.completed,
      })),
    });
    return res.data;
  },

  /**
   * Update an existing task (full update including subtasks).
   */
  updateTask: async (updatedTask: Task): Promise<Task> => {
    const res = await http.put(`/tasks/${updatedTask.id}`, {
      title:       updatedTask.title,
      description: updatedTask.description,
      status:      updatedTask.status,
      priority:    updatedTask.priority,
      due_date:    updatedTask.dueDate ?? null,
      complexity:  updatedTask.complexity,
      effort:      updatedTask.effort,
      importance:  updatedTask.importance,
      subtasks:    updatedTask.subtasks.map((s) => ({
        id:        s.id.startsWith('temp-') ? undefined : Number(s.id),
        title:     s.title,
        completed: s.completed,
      })),
    });
    return res.data;
  },

  /**
   * Delete a task by ID.
   */
  deleteTask: async (id: string): Promise<void> => {
    await http.delete(`/tasks/${id}`);
  },

  // ── Workload Metrics ──────────────────────────────────────────────────

  /**
   * Fetch workload distribution per weekday from the server.
   */
  getWorkload: async (): Promise<WorkloadStatus[]> => {
    const res = await http.get('/workload');
    return res.data;
  },
};

export default http;
