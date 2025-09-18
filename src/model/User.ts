import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string; // TS me string lowercase me likhte hai
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, // MOngoose me String uppercase me likhte
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  username: string; // TS me string lowercase me likhte hai
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String, // MOngoose me String uppercase me likhte
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code EXpiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema], // Embedded documents
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
