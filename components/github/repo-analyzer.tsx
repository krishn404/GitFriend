"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  GitBranch,
  Star,
  GitFork,
  Code,
  Calendar,
  ExternalLink,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react"
import type { GitHubRepo, GitHubCommit } from "@/lib/github-service"

interface RepoAnalyzerProps {
  initialRepo?: string
}

export function RepoAnalyzer({ initialRepo = "" }: RepoAnalyzerProps) {
  const [repoUrl, setRepoUrl] = useState(initialRepo)
  const [searchRepoUrl, setSearchRepoUrl] = useState(initialRepo)
  const [repoData, setRepoData] = useState<{ repository: GitHubRepo; commits: GitHubCommit[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<string | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const insightsRef = useRef<HTMLDivElement>(null)

  const parseRepoUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname !== "github.com") {
        throw new Error("Not a valid GitHub URL")
      }

      const pathParts = urlObj.pathname.split("/").filter(Boolean)
      if (pathParts.length < 2) {
        throw new Error("Not a valid repository URL")
      }

      return {
        owner: pathParts[0],
        repo: pathParts[1],
      }
    } catch (err) {
      // Try to parse as owner/repo format
      const parts = url.split("/")
      if (parts.length === 2) {
        return {
          owner: parts[0],
          repo: parts[1],
        }
      }

      throw new Error("Invalid repository URL or format")
    }
  }

  const fetchRepoData = async () => {
    if (!searchRepoUrl.trim()) {
      setError("Please enter a GitHub repository URL")
      return
    }

    setLoading(true)
    setError(null)
    setInsights(null)

    try {
      const { owner, repo } = parseRepoUrl(searchRepoUrl)

      const response = await fetch(
        `/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch repository data")
      }

      setRepoData(data)
      setRepoUrl(searchRepoUrl)

      // Generate insights
      generateInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setRepoData(null)
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = async (data: { repository: GitHubRepo; commits: GitHubCommit[] }) => {
    setInsightsLoading(true)

    try {
      const response = await fetch("/api/github/analyze-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repository: data.repository, commits: data.commits }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate insights")
      }

      setInsights(result.insights)

      // Scroll to insights after they're loaded
      setTimeout(() => {
        insightsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 300)
    } catch (err) {
      console.error("Error generating insights:", err)
    } finally {
      setInsightsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter GitHub repository URL (e.g., github.com/user/repo or user/repo)"
            value={searchRepoUrl}
            onChange={(e) => setSearchRepoUrl(e.target.value)}
            className="pl-9 h-10 bg-background border-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchRepoData()
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={fetchRepoData} disabled={loading} className="h-10">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Repository"
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !repoData && (
        <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-muted rounded-full mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-5 w-36 bg-muted rounded-full mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      )}

      {/* Repository Data */}
      {repoData && (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          {/* Repository Header */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
            <div className="px-4 sm:px-6 pb-6 -mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                    <GitBranch className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-xl font-medium text-foreground">{repoData.repository.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <a
                      href={repoData.repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary transition-colors text-sm"
                    >
                      {repoData.repository.full_name}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{repoData.repository.stargazers_count}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <GitFork className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">{repoData.repository.forks_count}</span>
                  </div>
                </div>
              </div>

              {repoData.repository.description && (
                <div className="mt-4 text-muted-foreground bg-muted/50 p-3 rounded-lg text-sm">
                  {repoData.repository.description}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Code className="h-4 w-4 text-primary mb-1" />
                  <span className="text-base font-medium text-foreground">{repoData.repository.language || "N/A"}</span>
                  <span className="text-xs text-muted-foreground">Language</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <GitBranch className="h-4 w-4 text-primary mb-1" />
                  <span className="text-base font-medium text-foreground">{repoData.repository.open_issues_count}</span>
                  <span className="text-xs text-muted-foreground">Open Issues</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Calendar className="h-4 w-4 text-primary mb-1" />
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(repoData.repository.created_at)}
                  </span>
                  <span className="text-xs text-muted-foreground">Created</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Activity className="h-4 w-4 text-primary mb-1" />
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(repoData.repository.pushed_at)}
                  </span>
                  <span className="text-xs text-muted-foreground">Last Updated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repository Topics */}
          {repoData.repository.topics && repoData.repository.topics.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <h3 className="text-base font-medium text-foreground mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {repoData.repository.topics.map((topic) => (
                  <span key={topic} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Commits */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              Recent Commits
            </h3>

            <div className="space-y-2">
              {repoData.commits.length > 0 ? (
                repoData.commits.slice(0, 5).map((commit) => (
                  <Card key={commit.sha} className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <a
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center group text-sm"
                        >
                          <span className="text-xs font-mono mr-2 bg-background px-1.5 py-0.5 rounded text-muted-foreground">
                            {commit.sha.substring(0, 7)}
                          </span>
                          <span className="truncate">{commit.commit.message.split("\n")[0]}</span>
                          <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                      <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
                        <span>{commit.commit.author.name}</span>
                        <span className="mx-1.5">•</span>
                        <span>{formatDate(commit.commit.author.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">No commits found</div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div ref={insightsRef} className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary-foreground">AI</span>
              </div>
              Repository Insights
            </h3>

            {insights ? (
              <div className="bg-muted/30 border border-border/50 rounded-lg p-4 text-muted-foreground text-sm animate-in fade-in-50 duration-300">
                {insights.split("\n").map((line, i) => (
                  <p key={i} className={`${line.trim() === "" ? "mb-3" : "mb-2"} leading-relaxed`}>
                    {line}
                  </p>
                ))}
              </div>
            ) : insightsLoading ? (
              <div className="bg-muted/30 border border-border/50 rounded-lg p-6 flex flex-col items-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
                <p className="text-muted-foreground text-sm">Analyzing repository data...</p>
                <p className="text-muted-foreground text-xs mt-1">This may take a few moments</p>
              </div>
            ) : (
              <div className="bg-muted/30 border border-border/50 rounded-lg p-6 text-center text-muted-foreground">
                No insights available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

