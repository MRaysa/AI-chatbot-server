import { Request, Response } from 'express';
import chatService from '../services/chat.service';
import { ApiResponse } from '../utils/apiResponse';

export class ChatController {
  /**
   * @desc    Create a new chat
   * @route   POST /api/chats
   * @access  Private
   */
  async createChat(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;
      const { title } = req.body;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const chat = await chatService.createChat(userId, title);

      return ApiResponse.created(res, 'Chat created successfully', {
        chat: {
          id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        },
      });
    } catch (error: any) {
      console.error('Create chat error:', error);
      return ApiResponse.error(res, error.message || 'Failed to create chat');
    }
  }

  /**
   * @desc    Get all chats for current user
   * @route   GET /api/chats
   * @access  Private
   */
  async getUserChats(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const chats = await chatService.getUserChats(userId);

      return ApiResponse.success(res, 'Chats retrieved successfully', {
        chats: chats.map((chat) => ({
          id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        })),
      });
    } catch (error: any) {
      console.error('Get chats error:', error);
      return ApiResponse.error(res, error.message || 'Failed to get chats');
    }
  }

  /**
   * @desc    Get messages for a specific chat
   * @route   GET /api/chats/:chatId/messages
   * @access  Private
   */
  async getChatMessages(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;
      const { chatId } = req.params;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      // Verify chat belongs to user
      const chat = await chatService.getChatById(chatId, userId);
      if (!chat) {
        return ApiResponse.notFound(res, 'Chat not found');
      }

      const messages = await chatService.getChatMessages(chatId);

      return ApiResponse.success(res, 'Messages retrieved successfully', {
        messages: messages.map((msg) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        })),
      });
    } catch (error: any) {
      console.error('Get messages error:', error);
      return ApiResponse.error(res, error.message || 'Failed to get messages');
    }
  }

  /**
   * @desc    Send a message and get AI response
   * @route   POST /api/chats/:chatId/messages
   * @access  Private
   */
  async sendMessage(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;
      const { chatId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      if (!content || !content.trim()) {
        return ApiResponse.badRequest(res, 'Message content is required');
      }

      const result = await chatService.sendMessage(chatId, userId, content);

      return ApiResponse.success(res, 'Message sent successfully', {
        userMessage: {
          id: result.userMessage._id,
          role: result.userMessage.role,
          content: result.userMessage.content,
          timestamp: result.userMessage.createdAt,
        },
        aiMessage: {
          id: result.aiMessage._id,
          role: result.aiMessage.role,
          content: result.aiMessage.content,
          timestamp: result.aiMessage.createdAt,
        },
        chat: {
          id: result.chat._id,
          title: result.chat.title,
          updatedAt: result.chat.updatedAt,
        },
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      return ApiResponse.error(res, error.message || 'Failed to send message');
    }
  }

  /**
   * @desc    Delete a chat
   * @route   DELETE /api/chats/:chatId
   * @access  Private
   */
  async deleteChat(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;
      const { chatId } = req.params;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      await chatService.deleteChat(chatId, userId);

      return ApiResponse.success(res, 'Chat deleted successfully');
    } catch (error: any) {
      console.error('Delete chat error:', error);
      return ApiResponse.error(res, error.message || 'Failed to delete chat');
    }
  }

  /**
   * @desc    Update chat title
   * @route   PATCH /api/chats/:chatId
   * @access  Private
   */
  async updateChatTitle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.uid;
      const { chatId } = req.params;
      const { title } = req.body;

      if (!userId) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      if (!title || !title.trim()) {
        return ApiResponse.badRequest(res, 'Title is required');
      }

      const chat = await chatService.updateChatTitle(chatId, userId, title);

      if (!chat) {
        return ApiResponse.notFound(res, 'Chat not found');
      }

      return ApiResponse.success(res, 'Chat title updated successfully', {
        chat: {
          id: chat._id,
          title: chat.title,
          updatedAt: chat.updatedAt,
        },
      });
    } catch (error: any) {
      console.error('Update chat title error:', error);
      return ApiResponse.error(res, error.message || 'Failed to update chat title');
    }
  }
}

export default new ChatController();
