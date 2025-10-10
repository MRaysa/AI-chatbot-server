import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: 'email' | 'google';
  stripeCustomerId?: string;
  subscriptionPlan: 'free' | 'pro' | 'team';
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    stripeCustomerId: {
      type: String,
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'team'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
