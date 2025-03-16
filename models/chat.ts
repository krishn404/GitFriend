import mongoose, { Schema, Document } from "mongoose"

// Define the message interface
export interface IMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Define the chat interface
export interface IChat extends Document {
  userId?: string
  messages: IMessage[]
  title: string
  createdAt: Date
  updatedAt: Date
}

// Define the message schema
const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

// Define the chat schema
const ChatSchema = new Schema<IChat>({
  userId: { type: String, index: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Update timestamps on save
ChatSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create and export the model
export const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema)

// Helper function to connect to MongoDB
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      autoCreate: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      retryWrites: true,
      retryReads: true
    })
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB')
    })

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Add a function to close the connection
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
    throw error
  }
}

