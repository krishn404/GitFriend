import { NextResponse } from "next/server"
import { connectToDatabase, ChatSession } from "@/models/chat"
import { v4 as uuidv4 } from "uuid"

// Get all chat sessions
export async function GET() {
  try {
    await connectToDatabase()

    const sessions = await ChatSession.find({})
      .sort({ updatedAt: -1 })
      .select("sessionId title createdAt updatedAt")
      .lean()

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 })
  }
}

// Create a new chat session
export async function POST(req: Request) {
  try {
    const { title, messages } = await req.json()

    await connectToDatabase()

    const sessionId = uuidv4()
    const firstMessage = messages && messages.length > 0 ? messages[0].content : ""
    const sessionTitle = title || firstMessage.substring(0, 30) + (firstMessage.length > 30 ? "..." : "")

    const newSession = new ChatSession({
      sessionId,
      title: sessionTitle,
      messages: messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newSession.save()

    return NextResponse.json({ session: newSession })
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
  }
}

