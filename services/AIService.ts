import { aiChatbotController } from '../apiControllers/aiChatbotController';

export const AIService = {
  sendMessage: async (message: string) => {
    try {
      console.log('Sending message to AI service:', message);
      const response = await aiChatbotController.chat(message);
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      console.log('AI response:', response.data.response);
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
