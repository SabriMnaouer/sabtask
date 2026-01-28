
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Task, Project, User, TimeEntry, Notification } from '../../types';
import { CURRENT_USER } from '../../constants';

export const useDataFetching = (
  isAuth: boolean, 
  user: User, 
  setUser: (u: User) => void,
  setIsLoading: (l: boolean) => void,
  addToast: (t: 'success' | 'error', m: string) => void
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Users
      const { data: userData } = await supabase.from('users').select('*');
      if (userData) {
          const mappedUsers = userData.map((u: any) => ({
              id: u.id,
              name: u.name,
              avatar: u.avatar,
              role: u.role,
              jobRole: u.job_role,
              email: u.email
          }));
          setUsers(mappedUsers as User[]);
          
          // Sync current user state with DB to persist avatar changes
          const currentUserData = mappedUsers.find((u: User) => u.id === user.id);
          if (currentUserData) {
            setUser(currentUserData);
          }
      }

      // 2. Fetch Projects
      const { data: projectData } = await supabase.from('projects').select('*');
      if (projectData) setProjects(projectData as Project[]);

      // 3. Fetch Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select(`*, subtasks (*), comments (*)`)
        .order('created_at', { ascending: false });

      if (taskData) {
        const formattedTasks: Task[] = taskData.map((t: any) => ({
          id: t.id,
          projectId: t.project_id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assigneeId: t.assignee_id,
          dueDate: t.due_date,
          tags: t.tags || [],
          subtasks: (t.subtasks || []).map((st: any) => ({
             id: st.id,
             title: st.title,
             completed: st.completed,
             assigneeId: st.assignee_id 
          })),
          comments: (t.comments || []).map((c: any) => ({
             id: c.id,
             userId: c.user_id,
             text: c.text,
             createdAt: c.createdAt
          })),
          createdAt: t.created_at
        }));
        setTasks(formattedTasks);
      }

      // 4. Fetch Time Entries
      const { data: timeData } = await supabase
        .from('time_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (timeData) {
        setTimeEntries(timeData.map((t: any) => ({
          id: t.id,
          taskId: t.task_id,
          userId: t.user_id,
          startTime: t.start_time,
          endTime: t.end_time,
          durationSeconds: t.duration_seconds,
          note: t.note,
          createdAt: t.created_at
        })));
      }
      
      // 5. Fetch Notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (notifData) setNotifications(notifData as Notification[]);

    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('error', 'Failed to load initial data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  return {
    tasks, setTasks,
    projects, setProjects,
    users, setUsers,
    timeEntries, setTimeEntries,
    notifications, setNotifications,
    refetch: fetchData
  };
};
