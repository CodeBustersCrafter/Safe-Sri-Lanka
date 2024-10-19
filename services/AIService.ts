import { aiChatbotController } from '../apiControllers/aiChatbotController';

export const AIService = {
  sendMessage: async (message: string) => {
    try {
      const response = await aiChatbotController.chat(message);
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      return {
        response: response.data.response,
        agent: response.data.agent
      };
    } catch (error) {
      console.error('Error in AIService.sendMessage:', error);
      throw error;
    }
  }
};
