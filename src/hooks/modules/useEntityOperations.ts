
import React from 'react';
import { supabase } from '../../services/supabaseClient';
import { Task, Project, User, TaskStatus } from '../../types';

export const useEntityOperations = (
  user: User,
  refetchData: () => void,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  addToast: (t: 'success' | 'error' | 'info', m: string) => void
) => {

  // --- Task Operations ---
  const handleTaskSave = async (task: Task, isEdit: boolean) => {
    try {
      const taskPayload = {
        id: task.id,
        project_id: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee_id: task.assigneeId,
        due_date: task.dueDate,
        tags: task.tags,
        created_at: task.createdAt
      };
      
      const { error } = await supabase.from('tasks').upsert(taskPayload);
      if (error) throw error;

      await supabase.from('subtasks').delete().eq('task_id', task.id);
      if (task.subtasks.length > 0) {
        const subtasksToInsert = task.subtasks.map(s => ({
          id: s.id,
          task_id: task.id,
          title: s.title,
          completed: s.completed,
          assignee_id: s.assigneeId
        }));
        await supabase.from('subtasks').insert(subtasksToInsert);
      }

      if (task.comments.length > 0) {
        const commentsToUpsert = task.comments.map(c => ({
          id: c.id,
          task_id: task.id,
          user_id: c.userId,
          text: c.text,
          created_at: c.createdAt
        }));
        await supabase.from('comments').upsert(commentsToUpsert);
      }

      refetchData();
      addToast('success', isEdit ? 'Task updated successfully' : 'Task created successfully');
      return true;
    } catch (e) {
      console.error("Failed to save task", e);
      addToast('error', 'Failed to save task to database.');
      return false;
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await supabase.from('tasks').delete().eq('id', taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      addToast('success', 'Task deleted');
      return true;
    } catch (e) {
      console.error("Failed to delete task", e);
      addToast('error', 'Failed to delete task');
      return false;
    }
  };

  const handleUpdateTaskStatus = async (id: string, status: TaskStatus) => {
    // Optimistic Update handled by caller via setTasks, here we just do DB
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
      if (error) throw error;
      addToast('info', `Status updated to ${status}`);
    } catch(e) {
      addToast('error', 'Failed to update status');
      refetchData(); // Revert on failure
    }
  };

  // --- Project Operations ---
  const handleProjectSave = async (project: Project, isEdit: boolean) => {
    try {
        const { error } = await supabase.from('projects').upsert(project);
        if (error) throw error;
        
        if (isEdit) {
            setProjects(prev => prev.map(p => p.id === project.id ? project : p));
            addToast('success', 'Project updated');
        } else {
            setProjects(prev => [...prev, project]);
            addToast('success', 'Project created');
        }
        return true;
    } catch (e) {
        console.error("Failed to save project", e);
        addToast('error', 'Failed to save project');
        return false;
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
        await supabase.from('projects').delete().eq('id', projectId);
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setTasks(prev => prev.filter(t => t.projectId !== projectId)); // Cascade cleanup locally
        addToast('success', 'Project deleted');
        return true;
    } catch (e) {
        console.error("Failed to delete project", e);
        addToast('error', 'Failed to delete project');
        return false;
    }
  };

  // --- Member Operations ---
  const handleMemberSave = async (member: User, isEdit: boolean) => {
    try {
       const dbMember = {
         id: member.id,
         name: member.name,
         email: member.email,
         role: member.role,
         avatar: member.avatar,
         job_role: member.jobRole
       };

       await supabase.from('users').upsert(dbMember);
       if (isEdit) {
         setUsers(prev => prev.map(u => u.id === member.id ? member : u));
         addToast('success', 'Member updated');
       } else {
         setUsers(prev => [...prev, member]);
         addToast('success', 'Member added');
       }
       return true;
    } catch (e) { 
        console.error(e);
        addToast('error', 'Operation failed');
        return false;
    }
  };

  const handleDeleteMember = async (userId: string) => {
     if(userId === user.id) return;
     try {
       await supabase.from('users').delete().eq('id', userId);
       setUsers(prev => prev.filter(u => u.id !== userId));
       addToast('success', 'Member removed');
     } catch (e) { 
         console.error(e); 
         addToast('error', 'Failed to remove member');
     }
  };

  const handleProfileUpdate = async (updatedUser: User) => {
    try {
      const dbUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        job_role: updatedUser.jobRole
      };

      await supabase.from('users').upsert(dbUser);
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      addToast('success', 'Profile updated');
      return true;
    } catch (e) {
       console.error("Failed to update profile", e);
       addToast('error', 'Update failed');
       return false;
    }
  };

  return {
    handleTaskSave, handleTaskDelete, handleUpdateTaskStatus,
    handleProjectSave, handleProjectDelete,
    handleMemberSave, handleDeleteMember, handleProfileUpdate
  };
};
