"use client"

import { useState, useRef } from "react"
import type { GitHubUser, GitHubRepo } from "@/lib/github-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Star, GitFork, ExternalLink, Calendar, Users, BookOpen, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface GitHubProfileProps {
  initialUsername?: string
}

export function GitHubProfile({ initialUsername = "" }: GitHubProfileProps) {
  const [username, setUsername] = useState(initialUsername)
  const [searchUsername, setSearchUsername] = useState(initialUsername)
  const [userData, setUserData] = useState<{ user: GitHubUser; repositories: GitHubRepo[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<string | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const insightsRef = useRef<HTMLDivElement>(null)

  const fetchUserData = async () => {
    if (!searchUsername.trim()) {
      setError("Please enter a GitHub username")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/github/user?username=${encodeURIComponent(searchUsername)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data")
      }

      setUserData(data)
      generateInsights(data)
      setUsername(searchUsername)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generateInsights = async (data: { user: GitHubUser; repositories: GitHubRepo[] }) => {
    setInsightsLoading(true)

    try {
      const response = await fetch("/api/github/analyze-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: data.user, repositories: data.repositories }),
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

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter GitHub username (e.g., octocat)"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="pl-9 h-10 bg-background border-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchUserData()
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={fetchUserData} disabled={loading} className="h-10">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search Profile"
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
      {loading && !userData && (
        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
          <div className="w-20 h-20 bg-muted rounded-full mb-4"></div>
          <div className="h-5 w-40 bg-muted rounded-full mb-2"></div>
          <div className="h-4 w-28 bg-muted rounded-full"></div>
        </div>
      )}

      {/* Profile Data */}
      {userData && (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
            <div className="px-4 sm:px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden">
                    <Image
                      src={userData.user.avatar_url || "/placeholder.svg?height=80&width=80"}
                      alt={`${userData.user.login}'s avatar`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 pt-2">
                  <h2 className="text-xl font-medium text-foreground">{userData.user.name || userData.user.login}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <a
                      href={userData.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary transition-colors text-sm"
                    >
                      @{userData.user.login}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* View on GitHub Button */}
                <a
                  href={userData.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm flex items-center gap-1.5 transition-colors"
                >
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Bio */}
              {userData.user.bio && (
                <div className="mt-4 text-muted-foreground bg-muted/50 p-3 rounded-lg text-sm">{userData.user.bio}</div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <BookOpen className="h-4 w-4 text-primary mb-1" />
                  <span className="text-lg font-medium text-foreground">{userData.user.public_repos}</span>
                  <span className="text-xs text-muted-foreground">Repositories</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Users className="h-4 w-4 text-primary mb-1" />
                  <span className="text-lg font-medium text-foreground">{userData.user.followers}</span>
                  <span className="text-xs text-muted-foreground">Followers</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Users className="h-4 w-4 text-primary mb-1" />
                  <span className="text-lg font-medium text-foreground">{userData.user.following}</span>
                  <span className="text-xs text-muted-foreground">Following</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                  <Calendar className="h-4 w-4 text-primary mb-1" />
                  <span className="text-sm font-medium text-foreground">{formatDate(userData.user.created_at)}</span>
                  <span className="text-xs text-muted-foreground">Joined</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repositories */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Top Repositories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userData.repositories.length > 0 ? (
                userData.repositories.map((repo) => (
                  <Card key={repo.id} className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium flex items-center text-sm"
                        >
                          {repo.name}
                          <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                        </a>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center text-xs text-muted-foreground">
                            <GitFork className="h-3 w-3 mr-1 text-primary" />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>

                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{repo.description}</p>
                      )}

                      <div className="flex items-center mt-3 gap-2 flex-wrap">
                        {repo.language && (
                          <span className="flex items-center text-xs px-2 py-1 bg-background rounded-full text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">No public repositories found</div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div ref={insightsRef} className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary-foreground">AI</span>
              </div>
              Profile Insights
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
                <p className="text-muted-foreground text-sm">Analyzing profile and repositories...</p>
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

