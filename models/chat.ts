import mongoose, { Schema, Document } from "mongoose"

export interface IMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  tokenCount?: number  // Optional token tracking
  metadata?: {
    [key: string]: any  // Flexible metadata storage
  }
}

export interface IChat extends Document {
  userId: string  // Made required
  messages: IMessage[]
  title: string
  totalTokens?: number  // Track total conversation tokens
  isArchived: boolean   // Add archiving capability
  lastInteractionAt: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tokenCount: { type: Number, default: 0 },
  metadata: { type: Schema.Types.Mixed, default: {} }
})

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true, index: true },
  title: { 
    type: String, 
    required: true,
    default: () => `Chat on ${new Date().toLocaleDateString()}`
  },
  messages: [MessageSchema],
  totalTokens: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  lastInteractionAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Middleware to update timestamps and track interactions
ChatSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  this.lastInteractionAt = new Date()
  
  // Auto-calculate total tokens
  this.totalTokens = this.messages.reduce((total, msg) => 
    total + (msg.tokenCount || 0), 0)
  
  // Auto-generate title if not provided
  if (!this.title) {
    this.title = `Chat on ${new Date().toLocaleDateString()}`
  }
  
  next()
})

// Indexing for performance
ChatSchema.index({ userId: 1, createdAt: -1 })
ChatSchema.index({ isArchived: 1 })

export const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema)

// Optional: Method to archive old chats
export async function archiveOldChats(
  daysOld: number = 30, 
  maxChatsToArchive: number = 100
) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  try {
    const result = await Chat.updateMany(
      { 
        createdAt: { $lt: cutoffDate },
        isArchived: false 
      },
      { 
        $set: { isArchived: true } 
      },
      { limit: maxChatsToArchive }
    )
    
    console.log(`Archived ${result.modifiedCount} chats older than ${daysOld} days`)
  } catch (error) {
    console.error('Error archiving chats:', error)
  }
}

// Existing connection methods remain the same
export async function connectToDatabase() { /* ... */ }
export async function disconnectFromDatabase() { /* ... */ }