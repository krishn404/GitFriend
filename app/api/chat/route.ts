import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export const runtime = "nodejs"
export const maxDuration = 60

const SYSTEM_PROMPT = `You are a helpful Git and GitHub expert. Your responses should be clear and detailed:

1. For general questions: Provide step-by-step instructions with commands in code blocks.

2. For error messages: 
   - Explain what caused the error
   - Provide solutions with code examples
   - Include relevant resources from:
     * Stack Overflow (with links)
     * Official documentation
     * Helpful blog posts or videos

3. When providing resources or learning materials:
   Structure your response like this:

   ## Beginner Resources
   - [Resource Name](URL) - Brief but informative description.
   - [Another Resource](URL) - What you'll learn from this.

   ## Advanced Topics
   - [Advanced Resource](URL) - Detailed description of content.

   ## Hands-on Practice
   - [Interactive Tutorial](URL) - What kind of practice you'll get.

4. Always format code using markdown code blocks with appropriate language tags.
5. For complex issues, provide multiple approaches when applicable.`

const apiKey = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content

    // Detect if the message is asking for specific actions
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
