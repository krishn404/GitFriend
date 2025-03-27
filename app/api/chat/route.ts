import { Groq } from "groq-sdk"
import { Chat } from "@/models/chat"
import mongoose from "mongoose"

export const runtime = "nodejs"
export const maxDuration = 30

const SYSTEM_PROMPT = `You are a concise Git and GitHub expert. Always prioritize showing commands over lengthy explanations.

If someone greets you, simply respond: "Hi! How can I help with Git/GitHub today?"

For non-Git/GitHub questions, respond: "I only help with Git/GitHub questions. Please ask about version control or GitHub."

For Git/GitHub questions:
1. Show relevant commands first in code blocks
2. Keep explanations under 2-3 sentences
3. Only explain if the command needs clarification
4. No general resources or links unless specifically requested
5. Do not include any meta-commentary or thought process in your responses
6. Never use <think> tags or similar markup in your responses`


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