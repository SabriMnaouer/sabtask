
import { useState } from 'react';
import { User, TaskStatus, Task, Project, SearchResult } from '../types';
import { CURRENT_USER } from '../constants';
import { supabase } from '../services/supabaseClient';

// Import New Modular Hooks
import { useUIState } from './modules/useUIState';
import { useDataFetching } from './modules/useDataFetching';
import { useSearchSystem } from './modules/useSearchSystem';
import { useTimeTracking } from './modules/useTimeTracking';
import { useEntityOperations } from './modules/useEntityOperations';

export const useAppLogic = () => {
  // --- Auth State ---
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<User>(CURRENT_USER);

  // --- 1. UI State Management ---
  const ui = useUIState();

  // --- 2. Data Fetching ---
  const data = useDataFetching(isAuth, user, setUser, ui.actions.setIsLoading, ui.actions.addToast);

  // --- 3. Search & Filtering ---
  const search = useSearchSystem(data.tasks, data.projects, data.users);

  // --- 4. Time Tracking ---
  const timer = useTimeTracking(user, data.setTimeEntries, ui.actions.addToast);

  // --- 5. Entity Operations (CRUD) ---
  const ops = useEntityOperations(
    user, data.refetch, 
    data.setTasks, data.setProjects, data.setUsers, setUser, 
    ui.actions.addToast
  );

  // --- Helper Wrappers for Actions ---
  // These connect the UI state setters with the Operation logic
  
  const handleTaskSaveWrapper = async (task: Task) => {
    const success = await ops.handleTaskSave(task, !!ui.state.editingTask);
    if (success) {
        ui.actions.setTaskModalOpen(false);
        ui.actions.setEditingTask(null);
    }
  };

  const handleTaskDeleteWrapper = async (taskId: string) => {
    const success = await ops.handleTaskDelete(taskId);
    if (success) {
        ui.actions.setTaskModalOpen(false);
        ui.actions.setEditingTask(null);
    }
  };

  const handleProjectSaveWrapper = async (project: Project) => {
    const success = await ops.handleProjectSave(project, !!ui.state.editingProject);
    if (success) {
        ui.actions.setProjectModalOpen(false);
        ui.actions.setEditingProject(null);
    }
  };

  const handleProjectDeleteWrapper = async (projectId: string) => {
    const success = await ops.handleProjectDelete(projectId);
    if (success && ui.state.selectedProject?.id === projectId) {
        ui.actions.setSelectedProject(null);
    }
  };

  const handleMemberSaveWrapper = async (member: User) => {
    const success = await ops.handleMemberSave(member, !!ui.state.editingMember);
    if (success) {
        ui.actions.setMemberModalOpen(false);
        ui.actions.setEditingMember(null);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
     switch (result.type) {
       case 'PROJECT':
         ui.actions.setSelectedProject(result.data as Project);
         ui.actions.setActiveTab('projects');
         break;
       case 'TASK':
         ui.actions.setEditingTask(result.data as Task);
         ui.actions.setTaskModalOpen(true);
         break;
       case 'MEMBER':
         ui.actions.setSelectedMember(result.data as User);
         ui.actions.setActiveTab('team');
         break;
       case 'COMMENT':
         const parentTask = data.tasks.find(t => t.id === result.referenceId);
         if (parentTask) {
             ui.actions.setEditingTask(parentTask);
             ui.actions.setTaskModalOpen(true);
         }
         break;
     }
     search.setGlobalSearchResults([]); // Clear
  };

  // --- Notifications Logic ---
  const markNotificationAsRead = async (id: string) => {
    data.setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const markAllNotificationsAsRead = async () => {
    data.setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
  };

  // --- Public Interface ---
  return {
    state: {
      ...ui.state,
      user, isAuth,
      tasks: search.filteredTasks, rawTasks: data.tasks, projects: data.projects, users: data.users,
      timeEntries: data.timeEntries, notifications: data.notifications,
      activeTimer: timer.activeTimer,
      filters: search.filters, globalSearchResults: search.globalSearchResults,
      searchQuery: search.filters.search, // Compatibility alias
    },
    actions: {
      ...ui.actions,
      setIsAuth,
      
      // Task Actions
      handleTaskSave: handleTaskSaveWrapper,
      handleTaskDelete: handleTaskDeleteWrapper,
      handleUpdateTaskStatus: (id: string, s: TaskStatus) => {
          // Optimistic local update for speed
          data.setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t));
          ops.handleUpdateTaskStatus(id, s);
      },
      openNewTaskModal: (status?: TaskStatus) => {
          ui.actions.setEditingTask(null);
          ui.actions.setNewTaskStatus(status || TaskStatus.TODO);
          ui.actions.setTaskModalOpen(true);
      },
      openEditTaskModal: (task: Task) => {
          ui.actions.setEditingTask(task);
          ui.actions.setTaskModalOpen(true);
      },

      // Project Actions
      handleProjectSave: handleProjectSaveWrapper,
      handleProjectDelete: handleProjectDeleteWrapper,
      openNewProjectModal: () => { ui.actions.setEditingProject(null); ui.actions.setProjectModalOpen(true); },
      openEditProjectModal: (p: Project) => { ui.actions.setEditingProject(p); ui.actions.setProjectModalOpen(true); },
      handleProjectClick: (p: Project) => { ui.actions.setSelectedProject(p); ui.actions.setActiveTab('projects'); },
      handleBackToProjects: () => ui.actions.setSelectedProject(null),

      // Member/Profile Actions
      handleProfileUpdate: (u: User) => ops.handleProfileUpdate(u),
      handleMemberSave: handleMemberSaveWrapper,
      handleDeleteMember: ops.handleDeleteMember,
      openNewMemberModal: () => { ui.actions.setEditingMember(null); ui.actions.setMemberModalOpen(true); },
      openEditMemberModal: (m: User) => { ui.actions.setEditingMember(m); ui.actions.setMemberModalOpen(true); },
      handleMemberClick: (m: User) => { ui.actions.setSelectedMember(m); ui.actions.setActiveTab('team'); },
      handleBackToTeam: () => ui.actions.setSelectedMember(null),

      // Timer Actions
      handleStartTimer: timer.handleStartTimer,
      handleStopTimer: timer.handleStopTimer,

      // Search Actions
      performGlobalSearch: search.performGlobalSearch,
      handleSearchResultClick,
      setSearchQuery: (q: string) => search.setFilters(prev => ({...prev, search: q})),
      setFilters: search.setFilters,

      // Notification Actions
      markNotificationAsRead,
      markAllNotificationsAsRead
    }
  };
};
