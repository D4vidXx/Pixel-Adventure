import { useEffect, useRef, useState, useCallback } from 'react';

export interface Player {
  name: string;
  role: 'host' | 'guest';
}

export function useMultiplayer(roomId: string | null, playerName: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [role, setRole] = useState<'host' | 'guest' | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Record<string, ((data: any) => void)[]>>({});
  const timeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (!roomId) return;
    setIsConnecting(true);
    setConnectionError(null);
    
    // Auto-detect secure WebSockets depending on current protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const backendHost = import.meta.env.VITE_MULTIPLAYER_HOST || host;
    const wsUrl = `${protocol}//${backendHost}/api/room/${roomId}?player=${encodeURIComponent(playerName)}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.warn("Multiplayer connection timeout");
        setConnectionError("Could not reach the multiplayer server. Check that the Cloudflare Worker /api/room route is deployed.");
        setIsConnecting(false);
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }
    }, 8000);

    ws.onopen = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "connected") {
          setRole(data.role);
          setPlayers(data.players);
        } else if (data.type === "player_joined" || data.type === "player_left") {
          setPlayers(data.players);
        }

        // Trigger registered callbacks
        const callbacks = listenersRef.current[data.type] || [];
        callbacks.forEach(callback => callback(data));
      } catch (err) {
        console.error("Multiplayer message parse error:", err);
      }
    };

    ws.onerror = (e) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.error("Multiplayer connection error:", e);
      setConnectionError("Multiplayer connection failed. The /api/room WebSocket route may not be available on this Cloudflare deployment.");
      setIsConnecting(false);
      setIsConnected(false);
    };

    ws.onclose = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
      setRole(null);
      setPlayers([]);
      if (roomId) {
        setConnectionError(prev => prev ?? "Multiplayer connection closed before the lobby was created.");
      }
    };
  }, [roomId, playerName]);

  const disconnect = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((type: string, payload: any = {}) => {
    try {
      if (!wsRef.current) {
        console.warn('[useMultiplayer.send] WebSocket not initialized');
        return;
      }
      if (wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[useMultiplayer.send] WebSocket not OPEN, readyState:', wsRef.current.readyState);
        return;
      }
      const message = JSON.stringify({ type, ...payload });
      console.log('[useMultiplayer.send]', type, payload);
      wsRef.current.send(message);
    } catch (error) {
      console.error('[useMultiplayer.send] Error:', error);
    }
  }, []);

  const on = useCallback((type: string, callback: (data: any) => void) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = [];
    }
    listenersRef.current[type].push(callback);

    // Return cleanup/unsubscribe function
    return () => {
      listenersRef.current[type] = (listenersRef.current[type] || []).filter(
        cb => cb !== callback
      );
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomId, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    role,
    players,
    connectionError,
    send,
    on,
    disconnect,
  };
}
