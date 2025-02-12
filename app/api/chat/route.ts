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

    // Detect if the message is asking for resources
    const isResourceRequest =
      lastMessage.toLowerCase().includes("resource") ||
      lastMessage.toLowerCase().includes("learn") ||
      lastMessage.toLowerCase().includes("tutorial") ||
      lastMessage.toLowerCase().includes("guide")

    // Detect if the message contains an error
    const isErrorMessage =
      lastMessage.toLowerCase().includes("error") ||
      lastMessage.toLowerCase().includes("failed") ||
      lastMessage.toLowerCase().includes("cannot")

    let prompt = lastMessage
    if (isResourceRequest) {
      prompt = `Please provide a structured list of learning resources for: ${lastMessage}`
    } else if (isErrorMessage) {
      prompt = `The user is experiencing the following Git error. Please analyze it and provide solutions with relevant resources:\n\n${lastMessage}`
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
