import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
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
      return new Response("API key is missing", { status: 500 })
    }

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system: SYSTEM_PROMPT,
      prompt,
    })

    return new Response(text)
  } catch (error) {
    return new Response("Error processing your request", { status: 500 })
  }
}
