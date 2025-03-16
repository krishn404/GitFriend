import { NextResponse } from "next/server"
import { connectToDatabase, Chat } from "@/models/chat"

// Get a specific chat session
export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    await connectToDatabase()

    const chat = await Chat.findById(sessionId).lean()

    if (!chat) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    return NextResponse.json({ session: chat })
  } catch (error) {
    console.error("Error fetching chat session:", error)
    return NextResponse.json({ error: "Failed to fetch chat session" }, { status: 500 })
  }
}

// Update a chat session
export async function PUT(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params
    const { title, messages } = await req.json()

    await connectToDatabase()

    const chat = await Chat.findById(sessionId)

    if (!chat) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    if (title) {
      chat.title = title
    }

    if (messages) {
      chat.messages = messages
    }

    chat.updatedAt = new Date()

    await chat.save()

    return NextResponse.json({ session: chat })
  } catch (error) {
    console.error("Error updating chat session:", error)
    return NextResponse.json({ error: "Failed to update chat session" }, { status: 500 })
  }
}

// Delete a chat session
export async function DELETE(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    await connectToDatabase()

    const result = await Chat.findByIdAndDelete(sessionId)

    if (!result) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 })
  }
}
