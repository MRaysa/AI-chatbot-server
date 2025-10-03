import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
});

export class AIService {
  /**
   * Generate AI response using OpenAI
   */
  async generateResponse(messages: Array<{ role: string; content: string }>) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return completion.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Generate AI response with streaming
   */
  async generateStreamingResponse(
    messages: Array<{ role: string; content: string }>
  ) {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      return stream;
    } catch (error: any) {
      console.error('OpenAI streaming error:', error);
      throw new Error(`AI streaming error: ${error.message}`);
    }
  }

  /**
   * Generate a title for the chat based on first message
   */
  async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate a short, concise title (max 5 words) for a chat that starts with this message. Only return the title, nothing else.',
          },
          {
            role: 'user',
            content: firstMessage,
          },
        ],
        temperature: 0.5,
        max_tokens: 20,
      });

      return completion.choices[0].message.content || 'New Chat';
    } catch (error) {
      console.error('Title generation error:', error);
      return firstMessage.slice(0, 30) + '...';
    }
  }
}

export default new AIService();
