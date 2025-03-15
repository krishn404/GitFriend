import { NextResponse } from "next/server"
import { connectToDatabase, ChatSession } from "@/models/chat"

// Get a specific chat session
export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    await connectToDatabase()

    const session = await ChatSession.findOne({ sessionId }).lean()

    if (!session) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    return NextResponse.json({ session })
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

    const session = await ChatSession.findOne({ sessionId })

    if (!session) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    if (title) {
      session.title = title
    }

    if (messages) {
      session.messages = messages
    }

    session.updatedAt = new Date()

    await session.save()

    return NextResponse.json({ session })
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

    const result = await ChatSession.deleteOne({ sessionId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 })
  }
}

