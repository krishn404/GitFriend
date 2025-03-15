import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { GitHubRepo, GitHubCommit } from "@/lib/github-service"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { repository, commits } = (await req.json()) as {
      repository: GitHubRepo
      commits: GitHubCommit[]
    }

    if (!repository) {
      return NextResponse.json({ error: "Repository data is required" }, { status: 400 })
    }

    const prompt = `
      You are a GitHub repository analyzer. Based on the following repository data, provide insightful analysis about:
      
      1. The project's purpose and main features
      2. Technology stack used (based on language, topics, etc.)
      3. Activity level and maintenance status
      4. Potential use cases or applications
      5. Any notable patterns in the commit history
      
      Keep your analysis concise but informative, with 4-5 paragraphs maximum.
      
      Repository data:
      ${JSON.stringify(
        {
          name: repository.name,
          full_name: repository.full_name,
          description: repository.description,
          language: repository.language,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          open_issues: repository.open_issues_count,
          created_at: repository.created_at,
          updated_at: repository.updated_at,
          pushed_at: repository.pushed_at,
          topics: repository.topics,
          visibility: repository.visibility,
        },
        null,
        2,
      )}
      
      Recent commits (${commits.length}):
      ${JSON.stringify(
        commits.slice(0, 5).map((commit) => ({
          message: commit.commit.message,
          author: commit.commit.author.name,
          date: commit.commit.author.date,
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
    console.error("Error analyzing repository:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze repository" },
      { status: 500 },
    )
  }
}

