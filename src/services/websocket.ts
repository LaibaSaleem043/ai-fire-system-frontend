import { JobProgress, Detection } from '@/types';

type WebSocketEvent = any; // Flexible for flat structures from backend

type EventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers: Set<EventHandler> = new Set();
  private reconnectInterval = 5000;
  private getUrl() {
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      if (isProduction) {
        return 'wss://laiba1232-smoke.hf.space/ws/alerts';
      }
    }
    return 'ws://127.0.0.1:8001/ws/alerts';
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect() {
    try {
      const wsUrl = this.getUrl();
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('[WS] Connected to FireGuard Alerts');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notify(data);
        } catch (e) {
          console.error('[WS] Parse error:', e);
        }
      };

      this.socket.onclose = () => {
        console.log('[WS] Disconnected. Reconnecting...');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.socket.onerror = (err) => {
        console.error('[WS] Error:', err);
      };
    } catch (error) {
      console.error('[WS] Connection failed:', error);
    }
  }

  public subscribe(handler: EventHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private notify(event: WebSocketEvent) {
    this.handlers.forEach(handler => handler(event));
  }
}

export const wsService = typeof window !== 'undefined' ? new WebSocketService() : null;
