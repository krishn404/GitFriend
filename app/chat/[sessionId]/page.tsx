import { Chat } from "@/components/chat"
import clientPromise from "@/lib/mongodb"

interface PageProps {
  params: {
    sessionId: string
  }
}

async function getChatSession(sessionId: string) {
  try {
    const client = await clientPromise
    const db = client.db("gitfriend")

    const session = await db.collection("chatsessions").findOne({ sessionId })

    if (!session) {
      return null
    }

    return {
      sessionId: session.sessionId,
      title: session.title,
      messages: session.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }
  } catch (error) {
    console.error("Error fetching chat session:", error)
    return null
  }
}

export default async function ChatSessionPage({ params }: PageProps) {
  const session = await getChatSession(params.sessionId)

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chat Session Not Found</h1>
          <p className="text-gray-400 mb-6">The chat session you're looking for doesn't exist or has been deleted.</p>
          <a href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Start a New Chat
          </a>
        </div>
      </div>
    )
  }

  return <Chat initialSessionId={params.sessionId} initialMessages={session.messages} />
}

