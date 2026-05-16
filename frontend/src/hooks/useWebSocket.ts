import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../AuthContext';

interface WebSocketMessage {
  type: string;
  message: any;
  sender_id: string;
  sender_username: string;
}

const useWebSocket = (path: string, onMessage: (message: WebSocketMessage) => void) => {
  const { isAuthenticated, token, userId } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  const connect = useCallback(() => {
    if (!isAuthenticated || !token || ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const socket = new WebSocket(`${WS_BASE_URL}${path}?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      setIsConnected(false);
      if (event.code !== 1000 && isAuthenticated) {
        console.log('Attempting to reconnect WebSocket...');
        setTimeout(connect, 3000);
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(event);
      setIsConnected(false);
    };

    ws.current = socket;

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection');
        ws.current.close();
      }
    };
  }, [isAuthenticated, token, path, onMessage]);

  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = connect();
      return cleanup;
    } else {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
  }, [isAuthenticated, connect]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not open. Message not sent:', message);
    }
  };

  return { ws: ws.current, isConnected, error, sendMessage, connect };
};

export default useWebSocket;
