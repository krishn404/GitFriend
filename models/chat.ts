import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define the message interface
export interface IMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Define the chat session interface
export interface IChatSession extends Document {
  sessionId: string
  title: string
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

// Define the message schema
const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

// Define the chat session schema
const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create and export the model
export const ChatSession: Model<IChatSession> =
  mongoose.models.ChatSession || mongoose.model<IChatSession>("ChatSession", ChatSessionSchema)

// Helper function to connect to MongoDB
export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://krishn404:kr!5n4@m0ng0@gitfriend.f7iha.mongodb.net/?retryWrites=true&w=majority&appName=GitFriend"

  return mongoose.connect(MONGODB_URI)
}

