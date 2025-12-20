import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') }
    });

    socket.emit('join', userId); 

    socket.on('task_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['global_tasks'] });
    });

    // Handle instant, persistent in-app assignment notifications
    socket.on('notification', (data: { message: string }) => {
      toast.success(data.message, {
        duration: 4000,
        style: { 
          background: '#1e1e1e', 
          color: '#ff9100', 
          border: '1px solid #c27111',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px'
        },
        icon: '🚀'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, queryClient]);
};