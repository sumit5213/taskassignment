import API from '../axios';

export const taskApi = {
  getDashboard: async () => {
    const { data } = await API.get('/tasks/dashboard');
    return data;
  },
  
  // Fixed: Using PATCH for updates and passing body correctly
  updateTask: async (taskId: string, updateData: any) => {
    const { data } = await API.patch(`/tasks/${taskId}`, updateData);
    return data;
  },

  createTask: async (taskData: any) => {
    const { data } = await API.post('/tasks', taskData);
    return data;
  }
};