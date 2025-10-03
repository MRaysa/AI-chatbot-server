import Chat, { IChat } from '../models/Chat.model';
import Message, { IMessage } from '../models/Message.model';
import aiService from './ai.service';
import { Types } from 'mongoose';

export class ChatService {
  /**
   * Create a new chat
   */
  async createChat(userId: string, title?: string): Promise<IChat> {
    try {
      const chat = await Chat.create({
        userId,
        title: title || 'New Chat',
      });
      return chat;
    } catch (error: any) {
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }

  /**
   * Get all chats for a user
   */
  async getUserChats(userId: string): Promise<IChat[]> {
    try {
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(50);
      return chats;
    } catch (error: any) {
      throw new Error(`Failed to get chats: ${error.message}`);
    }
  }

  /**
   * Get a single chat by ID
   */
  async getChatById(chatId: string, userId: string): Promise<IChat | null> {
    try {
      const chat = await Chat.findOne({ _id: chatId, userId });
      return chat;
    } catch (error: any) {
      throw new Error(`Failed to get chat: ${error.message}`);
    }
  }

  /**
   * Delete a chat and all its messages
   */
  async deleteChat(chatId: string, userId: string): Promise<void> {
    try {
      await Chat.findOneAndDelete({ _id: chatId, userId });
      await Message.deleteMany({ chatId });
    } catch (error: any) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  }

  /**
   * Get all messages for a chat
   */
  async getChatMessages(chatId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
      return messages;
    } catch (error: any) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    chatId: string,
    userId: string,
    content: string
  ): Promise<{ userMessage: IMessage; aiMessage: IMessage; chat: IChat }> {
    try {
      // Verify chat belongs to user
      const chat = await this.getChatById(chatId, userId);
      if (!chat) {
        throw new Error('Chat not found or unauthorized');
      }

      // Save user message
      const userMessage = await Message.create({
        chatId,
        role: 'user',
        content,
      });

      // Get chat history for context
      const previousMessages = await this.getChatMessages(chatId);

      // Prepare messages for AI (excluding the just-added user message to avoid duplication)
      const userMessageId = (userMessage as any)._id as Types.ObjectId;
      const conversationHistory = previousMessages
        .filter(msg => {
          const msgId = (msg as any)._id as Types.ObjectId;
          return msgId.toString() !== userMessageId.toString();
        })
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content,
      });

      // Get AI response
      const aiResponse = await aiService.generateResponse(conversationHistory);

      // Save AI message
      const aiMessage = await Message.create({
        chatId,
        role: 'assistant',
        content: aiResponse || 'I apologize, but I could not generate a response.',
      });

      // Update chat's updatedAt and title if first message
      if (previousMessages.length === 0) {
        const title = await aiService.generateChatTitle(content);
        chat.title = title;
        await chat.save();
      } else {
        chat.updatedAt = new Date();
        await chat.save();
      }

      return { userMessage, aiMessage, chat };
    } catch (error: any) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Update chat title
   */
  async updateChatTitle(
    chatId: string,
    userId: string,
    title: string
  ): Promise<IChat | null> {
    try {
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        { title },
        { new: true }
      );
      return chat;
    } catch (error: any) {
      throw new Error(`Failed to update chat title: ${error.message}`);
    }
  }
}

export default new ChatService();
