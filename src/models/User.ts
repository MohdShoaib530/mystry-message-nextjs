import { create } from 'domain';
import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifycodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      'Please provide a valid email.'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.']
  },
  verifyCode: {
    type: String,
    required: [true, 'Please provide a verification code.']
  },
  verifycodeExpiry: {
    type: Date,
    required: [true, 'Please provide a verification code expiry date.']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  messages: [MessageSchema]
});

const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default User;
