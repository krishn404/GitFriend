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

    // Check if the last message contains a repository name
    const repoNameMatch = lastMessage.match(/repository name is (\w+)/);
    const repoName = repoNameMatch ? repoNameMatch[1] : null;

    let responseText = "";

    if (repoName) {
      // Dynamic commands based on the repository name
      responseText = `
Create a new repository on the command line:
\`\`\`bash
echo "# ${repoName}" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/krishn404/${repoName}.git
git push -u origin main
\`\`\`

…or push an existing repository from the command line:
\`\`\`bash
git remote add origin https://github.com/krishn404/${repoName}.git
git branch -M main
git push -u origin main
\`\`\`
      `;
    } else {
      // If no repository name is found, use the last message as the prompt for the AI
      responseText = lastMessage;
    }

    if (!apiKey) {
      return new Response("API key is missing", { status: 500 })
    }

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system: SYSTEM_PROMPT,
      prompt: responseText,
    })

    return new Response(text)
  } catch (error) {
    return new Response("Error processing your request", { status: 500 })
  }
}

