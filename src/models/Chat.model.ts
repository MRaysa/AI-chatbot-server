import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ userId: 1, updatedAt: -1 });

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
