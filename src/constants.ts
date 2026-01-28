
import { User, NavItemConfig, TaskStatus, Task, Priority, Channel, ChatMessage } from './types';

// --- INITIAL USER (For Auth Simulation) ---
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Sabri Dev',
  avatar: 'https://picsum.photos/seed/sabri/100/100',
  role: 'ADMIN',
  jobRole: 'Product Owner',
  email: 'sabrimn@sabtask.com'
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
      bg: 'bg-white dark:bg-dark-surface',
      headerBorder: 'border-slate-200 dark:border-slate-800',
      dotColor: 'bg-slate-400'
  },
  { 
      id: TaskStatus.IN_PROGRESS, 
      title: 'In Progress', 
      bg: 'bg-white dark:bg-dark-surface',
      headerBorder: 'border-primary-200 dark:border-primary-800',
      dotColor: 'bg-primary-500' // Pink
  },
  { 
      id: TaskStatus.REVIEW, 
      title: 'Review', 
      bg: 'bg-white dark:bg-dark-surface',
      headerBorder: 'border-slate-800 dark:border-slate-200', // Black (Dark Grey) in Light Mode
      dotColor: 'bg-slate-900 dark:bg-slate-100' // Black
  },
  { 
      id: TaskStatus.DONE, 
      title: 'Done', 
      bg: 'bg-white dark:bg-dark-surface',
      headerBorder: 'border-secondary-200 dark:border-secondary-800',
      dotColor: 'bg-secondary-500' // Green
  },
];

// Colors Pink/Green/Black/White theme
export const CHART_COLORS = {
  purple: '#EC4899', // Pink
  pink: '#10B981',   // Green
  orange: '#111827', // Black (Dark Grey)
  blue: '#6B7280',   // Grey
  teal: '#374151',   // Dark Grey
  slate: '#E5E7EB'   // Light Grey
};

export const STATUS_COLORS = {
  [TaskStatus.TODO]: '#9CA3AF',        // Grey
  [TaskStatus.IN_PROGRESS]: '#EC4899', // Pink
  [TaskStatus.REVIEW]: '#111827',      // Black
  [TaskStatus.DONE]: '#10B981',        // Green
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
