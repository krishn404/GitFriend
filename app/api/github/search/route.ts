import { NextResponse } from "next/server"
import { searchRepositories } from "@/lib/github-service"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    const results = await searchRepositories(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search repositories" },
      { status: 500 },
    )
  }
}

