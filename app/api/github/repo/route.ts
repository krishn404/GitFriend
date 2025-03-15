import { NextResponse } from "next/server"
import { getRepositoryDetails, getRepositoryCommits } from "@/lib/github-service"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 })
  }

  try {
    const [repoDetails, commits] = await Promise.all([
      getRepositoryDetails(owner, repo),
      getRepositoryCommits(owner, repo),
    ])

    return NextResponse.json({ repository: repoDetails, commits })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch repository data" },
      { status: 500 },
    )
  }
}

