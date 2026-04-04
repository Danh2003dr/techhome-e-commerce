import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getToken } from '@/services/api';
import { getSocketBaseUrl } from '@/services/socketUrl';

/**
 * Socket mẫu backend: welcome(JWT) → openChat(peerId) → newMess để đồng bộ UI.
 */
export function useChatSocket(enabled: boolean, peerId: string | null, onNewMess: () => void) {
  const socketRef = useRef<Socket | null>(null);
  const onNewRef = useRef(onNewMess);
  onNewRef.current = onNewMess;
  const peerRef = useRef(peerId);
  peerRef.current = peerId;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const token = getToken();
    if (!token) {
      return;
    }

    const s = io(getSocketBaseUrl(), {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = s;

    s.on('newMess', () => {
      onNewRef.current();
    });

    s.on('connect', () => {
      s.emit('welcome', { auth: token });
    });

    s.on('username', () => {
      const p = peerRef.current;
      if (p) {
        s.emit('openChat', p);
      }
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s || !peerId) {
      return;
    }
    if (s.connected) {
      s.emit('openChat', peerId);
    }
  }, [peerId]);

  const emitNewMess = useCallback((fromUserId: number, toUserId: number) => {
    socketRef.current?.emit('newMess', { fromUserId, toUserId });
  }, []);

  return { emitNewMess };
}
