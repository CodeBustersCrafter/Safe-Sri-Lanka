import { BACKEND_URL_AI_CHAT } from '../app/const';

export const aiChatbotController = {
  chat: async (message: string): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL_AI_CHAT}/ai_assistant/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ok: true,
        data: {
          response: data.response,
          agent: data.agent
        }
      };
    } catch (error) {
      console.error('Error in aiChatbotController.chat:', error);
      return {
        ok: false,
        error: (error as Error).message
      };
    }
  },
};

