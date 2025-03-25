import { Groq } from "groq-sdk"
import { Chat } from "@/models/chat"
import mongoose from "mongoose"

export const runtime = "nodejs"
export const maxDuration = 30

const SYSTEM_PROMPT = `You are a helpful Git and GitHub expert. Keep your responses concise and focused.

If someone greets you, respond briefly with: "Hello! I'm your Git and GitHub assistant. How can I help you with version control or GitHub today?"

For any questions not related to Git or GitHub, respond with: "I apologize, but I can only help with Git and GitHub related questions. Please ask me about version control, repositories, or GitHub features."

For Git/GitHub questions:
1. Provide clear, concise steps
2. Use code blocks for commands
3. Keep explanations brief but informative
4. Include essential resources only when necessary`

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages, chatId, userId } = await req.json()
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages format", { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const text = completion.choices[0].message.content || "No response generated"

    try {
      await mongoose.connect(process.env.MONGODB_URI!)
      const chatMessage = { role: "assistant", content: text, timestamp: new Date() }

      if (chatId) {
        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: chatMessage },
          $set: { updatedAt: new Date() }
        })
      } else {
        await Chat.create({
          userId,
          title: messages[0].content.substring(0, 50),
          messages: [...messages, chatMessage]
        })
      }
    } catch (dbError) {
      console.error("MongoDB error:", dbError)
    }

    return new Response(text)
  } catch (error) {
    console.error("Chat error:", error)
    return new Response("Error processing your request", { status: 500 })
  }
}