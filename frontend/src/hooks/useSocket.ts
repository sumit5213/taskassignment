import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

let socket: Socket;

export const useSocket = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket = io('http://localhost:5000');
      
      // Join a room based on user ID for private notifications
      socket.emit('join', user.id);

      socket.on('notification', (data) => {
        alert(data.message); // You can replace this with a nice toast later
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return socket;
};