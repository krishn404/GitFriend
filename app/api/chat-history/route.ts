import { NextResponse } from "next/server"
import { connectToDatabase, Chat } from "@/models/chat"

// Get all chat sessions
export async function GET() {
  try {
    await connectToDatabase()

    const chats = await Chat.find({})
      .sort({ updatedAt: -1 })
      .select("_id title messages createdAt updatedAt")
      .lean()
      .timeout(5000) // Set timeout for query

    if (!chats) {
      return NextResponse.json({ sessions: [] })
    }

    return NextResponse.json({ sessions: chats })
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    
    // Check for specific error types
    if (error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { error: "Database connection timed out. Please try again." }, 
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" }, 
      { status: 500 }
    )
  }
}

// Create a new chat session
export async function POST(req: Request) {
  try {
    const { title, messages } = await req.json()

    await connectToDatabase()

    const firstMessage = messages && messages.length > 0 ? messages[0].content : ""
    const chatTitle = title || firstMessage.substring(0, 30) + (firstMessage.length > 30 ? "..." : "")

    const newChat = new Chat({
      title: chatTitle,
      messages: messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newChat.save({ timeout: 5000 }) // Set timeout for save operation

    return NextResponse.json({ session: newChat })
  } catch (error) {
    console.error("Error creating chat session:", error)
    
    if (error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { error: "Database operation timed out. Please try again." }, 
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create chat session" }, 
      { status: 500 }
    )
  }
}
