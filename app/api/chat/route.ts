import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { Chat } from "@/models/chat"
import mongoose from "mongoose"

export const runtime = "nodejs"
export const maxDuration = 60

const SYSTEM_PROMPT = `You are a helpful Git and GitHub expert. Keep your responses concise and focused.

If someone greets you, respond briefly with: "Hello! I'm your Git and GitHub assistant. How can I help you with version control or GitHub today?"

For any questions not related to Git or GitHub, respond with: "I apologize, but I can only help with Git and GitHub related questions. Please ask me about version control, repositories, or GitHub features."

For Git/GitHub questions:
1. Provide clear, concise steps
2. Use code blocks for commands
3. Keep explanations brief but informative
4. Include essential resources only when necessary`

const apiKey = process.env.GROQ_API_KEY

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) return
  
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  
  await mongoose.connect(MONGODB_URI)
}

export async function POST(req: Request) {
  try {
    const { messages, chatId, userId } = await req.json()
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages format", { status: 400 })
    }

    await connectDB()
    
    const lastMessage = messages[messages.length - 1].content

    // Check if message is not related to Git/GitHub
    const gitKeywords = ['git', 'github', 'repo', 'commit', 'branch', 'merge', 'pull', 'push', 'clone']
    const isGitRelated = gitKeywords.some(keyword => 
      lastMessage.toLowerCase().includes(keyword)
    )
    
    // If it's a greeting, let the system prompt handle it
    const isGreeting = /^(hi|hello|hey|greetings|hi there)/i.test(lastMessage.trim())
    
    // For non-Git/GitHub questions (except greetings)
    if (!isGitRelated && !isGreeting) {
      return new Response("I apologize, but I can only help with Git and GitHub related questions. Please ask me about version control, repositories, or GitHub features.")
    }

    // Rest of the message handling
    let prompt = lastMessage
    if (lastMessage.toLowerCase().includes("trending repo")) {
      prompt = "Please provide the current trending repositories on GitHub."
    } else if (lastMessage.toLowerCase().includes("create repo")) {
      prompt = "Please provide the steps to create a new repository on GitHub."
    } else if (lastMessage.toLowerCase().includes("commands")) {
      prompt = "Please provide a list of common Git commands."
    }

    if (!apiKey) {
      console.error("GROQ API key is missing")
      return new Response("Configuration error", { status: 500 })
    }

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system: SYSTEM_PROMPT,
      prompt: lastMessage,
    })

    // Save chat to MongoDB
    try {
      const chatMessage = {
        role: "assistant" as const,
        content: text,
        timestamp: new Date()
      }

      if (chatId) {
        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: chatMessage },
          $set: { updatedAt: new Date() }
        })
      } else {
        const title = lastMessage.substring(0, 50) + (lastMessage.length > 50 ? "..." : "")
        await Chat.create({
          userId,
          title,
          messages: [
            ...messages.map(m => ({
              ...m,
              timestamp: new Date()
            })),
            chatMessage
          ]
        })
      }
    } catch (dbError) {
      console.error("MongoDB error:", dbError)
      // Continue even if save fails - at least return the AI response
    }

    return new Response(text)
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(
      "Error processing your request. Please try again.", 
      { status: 500 }
    )
  }
}