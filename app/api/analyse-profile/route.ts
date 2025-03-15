import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { GitHubUser, GitHubRepo } from "@/lib/github-service"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { user, repositories } = (await req.json()) as {
      user: GitHubUser
      repositories: GitHubRepo[]
    }

    if (!user) {
      return NextResponse.json({ error: "User data is required" }, { status: 400 })
    }

    const prompt = `
      You are a GitHub profile analyzer. Based on the following user data and repositories, provide insightful analysis about:
      
      1. The developer's main areas of expertise and interests
      2. Primary programming languages and technologies used
      3. Activity level and contribution patterns
      4. Notable projects and their significance
      5. Overall GitHub presence and engagement
      
      Keep your analysis concise but informative, with 4-5 paragraphs maximum.
      
      User data:
      ${JSON.stringify(
        {
          login: user.login,
          name: user.name,
          bio: user.bio,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at,
        },
        null,
        2,
      )}
      
      Top repositories (${repositories.length}):
      ${JSON.stringify(
        repositories.map((repo) => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics,
        })),
        null,
        2,
      )}
    `

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("Error analyzing profile:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze profile" },
      { status: 500 },
    )
  }
}

