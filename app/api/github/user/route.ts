import { NextResponse } from "next/server"
import { getUserDetails, getUserRepositories } from "@/lib/github-service"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const [userDetails, userRepos] = await Promise.all([getUserDetails(username), getUserRepositories(username)])

    return NextResponse.json({ user: userDetails, repositories: userRepos })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch GitHub data" },
      { status: 500 },
    )
  }
}

