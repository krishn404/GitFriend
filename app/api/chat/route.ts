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
3. Always format code using markdown code blocks with appropriate language tags.
4. For complex issues, provide multiple approaches when applicable.

Use this format for resources:
### Additional Resources
- [Title](URL) - Brief description
`

const apiKey = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content

    // Detect if the message contains an error
    const isErrorMessage =
      lastMessage.toLowerCase().includes("error") ||
      lastMessage.toLowerCase().includes("failed") ||
      lastMessage.toLowerCase().includes("cannot")

    const prompt = isErrorMessage
      ? `The user is experiencing the following Git error. Please analyze it and provide solutions with relevant resources:\n\n${lastMessage}`
      : lastMessage

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

