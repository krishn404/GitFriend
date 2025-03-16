import { NextResponse } from "next/server"
import { Chat } from "@/models/chat"
import mongoose from "mongoose"

async function connectDB() {
  if (mongoose.connections[0].readyState) return
  
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  
  await mongoose.connect(MONGODB_URI)
}

export async function GET(req: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const chats = await Chat.find({ userId })
      .select("title messages createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ chats })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
} 