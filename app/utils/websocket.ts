import { BACKEND_URL } from '../const';

let ws: WebSocket | null = null;

export const connectWebSocket = (onMessage: (data: any) => void) => {
  ws = new WebSocket(`ws://${BACKEND_URL.replace('http://', '')}/safe_srilanka/ws`);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Attempt to reconnect after a delay
    setTimeout(() => connectWebSocket(onMessage), 5000);
  };
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
  }
};
