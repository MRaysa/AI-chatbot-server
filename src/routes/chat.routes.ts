import { Router } from 'express';
import chatController from '../controllers/chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All chat routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/chats
 * @desc    Create a new chat
 * @access  Private
 */
router.post('/', chatController.createChat);

/**
 * @route   GET /api/chats
 * @desc    Get all chats for current user
 * @access  Private
 */
router.get('/', chatController.getUserChats);

/**
 * @route   GET /api/chats/:chatId/messages
 * @desc    Get messages for a specific chat
 * @access  Private
 */
router.get('/:chatId/messages', chatController.getChatMessages);

/**
 * @route   POST /api/chats/:chatId/messages
 * @desc    Send a message and get AI response
 * @access  Private
 */
router.post('/:chatId/messages', chatController.sendMessage);

/**
 * @route   DELETE /api/chats/:chatId
 * @desc    Delete a chat
 * @access  Private
 */
router.delete('/:chatId', chatController.deleteChat);

/**
 * @route   PATCH /api/chats/:chatId
 * @desc    Update chat title
 * @access  Private
 */
router.patch('/:chatId', chatController.updateChatTitle);

export default router;
