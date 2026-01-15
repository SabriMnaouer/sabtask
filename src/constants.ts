
import { User, NavItemConfig, TaskStatus, Task, Priority, Channel, ChatMessage } from './types';

// --- INITIAL USER (For Auth Simulation) ---
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Sab Dev',
  avatar: './assets/s.svg',
  role: 'ADMIN',
  jobRole: 'Product Owner',
  email: 'sabmn@sabtask.com'
};

// --- UI CONFIGURATION ---

export const NAV_CONFIG: NavItemConfig[] = [
  { id: 'dashboard', iconId: 'dashboard', label: 'Overview' },
  { id: 'projects', iconId: 'folder', label: 'Projects' },
  { id: 'kanban', iconId: 'kanban', label: 'Kanban Board' },
  { id: 'list', iconId: 'list', label: 'Task List' },
  { id: 'hub', iconId: 'hub', label: 'Team Hub' },
  { id: 'calendar', iconId: 'calendar', label: 'Calendar' },
  { id: 'time', iconId: 'time', label: 'Time Tracking' },
  { id: 'team', iconId: 'team', label: 'Team Members' },
];

export const KANBAN_COLUMNS = [
  { 
      id: TaskStatus.TODO, 
      title: 'To Do', 
      // Paper style: White bg, specific border colors for status
      bg: 'bg-white dark:bg-stone-900',
      headerBorder: 'border-slate-200 dark:border-stone-700',
      dotColor: 'bg-slate-400'
  },
  { 
      id: TaskStatus.IN_PROGRESS, 
      title: 'In Progress', 
      bg: 'bg-white dark:bg-stone-900',
      headerBorder: 'border-primary-200 dark:border-primary-800',
      dotColor: 'bg-primary-500' // Gold
  },
  { 
      id: TaskStatus.REVIEW, 
      title: 'Review', 
      bg: 'bg-white dark:bg-stone-900',
      headerBorder: 'border-secondary-200 dark:border-secondary-800',
      dotColor: 'bg-secondary-500' // Brown
  },
  { 
      id: TaskStatus.DONE, 
      title: 'Done', 
      bg: 'bg-white dark:bg-stone-900',
      headerBorder: 'border-emerald-200 dark:border-emerald-800',
      dotColor: 'bg-emerald-600' // Deep Green (Olive-ish)
  },
];

// Earthy, Premium Chart Colors
export const CHART_COLORS = {
  purple: '#C7A14A', // Primary Gold
  pink: '#8B5E3C',   // Secondary Brown
  orange: '#D97706', // Amber/Orange
  blue: '#475569',   // Slate Blue 
  teal: '#57534E',   // Warm Stone
  slate: '#A8A29E'   // Light Stone
};

export const STATUS_COLORS = {
  [TaskStatus.TODO]: '#7A7A7A',        // Muted Gray
  [TaskStatus.IN_PROGRESS]: '#C7A14A', // Gold
  [TaskStatus.REVIEW]: '#8B5E3C',      // Brown
  [TaskStatus.DONE]: '#059669',        // Emerald/Olive Green
};

export const DASHBOARD_TREND_DATA = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 18 },
  { day: 'Wed', tasks: 15 },
  { day: 'Thu', tasks: 25 },
  { day: 'Fri', tasks: 20 },
  { day: 'Sat', tasks: 8 },
  { day: 'Sun', tasks: 10 },
];

export const MOCK_CHANNELS: Channel[] = [
  { id: 'c1', name: 'general', type: 'TEXT' },
  { id: 'c2', name: 'development', type: 'TEXT' },
  { id: 'c3', name: 'design', type: 'TEXT' },
  { id: 'v1', name: 'Standup Room', type: 'VOICE', connectedUserIds: ['u2', 'u3'] },
  { id: 'v2', name: 'Deep Work', type: 'VOICE', connectedUserIds: [] },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', channelId: 'c1', userId: 'u2', text: 'Has anyone seen the updated designs?', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'm2', channelId: 'c1', userId: 'u1', text: 'Yes, I uploaded them to Project A.', createdAt: new Date(Date.now() - 3500000).toISOString() },
  { id: 'm3', channelId: 'c2', userId: 'u3', text: 'API is throwing 500s on the staging server.', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'm4', channelId: 'c1', userId: 'ai', text: 'I can help summarize those design updates if you link the project.', createdAt: new Date(Date.now() - 3400000).toISOString(), isAi: true },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Design System Audit',
    description: 'Review current design system components for consistency.',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    assigneeId: 'u1',
    dueDate: new Date().toISOString(),
    tags: ['Design', 'Audit'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'API Integration',
    description: 'Integrate the new payment gateway API.',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    assigneeId: 'u2',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    tags: ['Backend', 'API'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 't3',
    projectId: 'p2',
    title: 'User Testing',
    description: 'Conduct user testing sessions for the new feature.',
    status: TaskStatus.REVIEW,
    priority: Priority.LOW,
    assigneeId: 'u3',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    tags: ['QA', 'Testing'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString()
  }
];
