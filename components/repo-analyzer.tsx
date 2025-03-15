"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, GitBranch, Star, GitFork, Code, Calendar, ExternalLink, Activity, Loader2, AlertCircle } from 'lucide-react'
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
        insightsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter GitHub repository URL (e.g., github.com/user/repo or user/repo)"
            value={searchRepoUrl}
            onChange={(e) => setSearchRepoUrl(e.target.value)}
            className="bg-gray-800/50 border-gray-700/50 text-white pl-10 h-12 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchRepoData()
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button 
          onClick={fetchRepoData} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-xl"
        >
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

      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-5 w-5 text-red-400" />
          {error}
        </div>
      )}

      {loading && !repoData && (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 animate-pulse">
          <div className="h-8 w-64 bg-gray-700/50 rounded-full mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700/50 rounded-xl"></div>
            ))}
          </div>
          <div className="h-6 w-48 bg-gray-700/50 rounded-full mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      )}

      {repoData && (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          {/* Repository Header */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl bg-gray-800 border-4 border-gray-900 flex items-center justify-center">
                    <GitBranch className="h-10 w-10 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-2xl font-bold text-white">{repoData.repository.name}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <a
                      href={repoData.repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-400 transition-colors"
                    >
                      {repoData.repository.full_name}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-gray-300">
                    <Star className="h-5 w-5 mr-1 text-yellow-400" />
                    <span className="font-semibold">{repoData.repository.stargazers_count}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <GitFork className="h-5 w-5 mr-1 text-blue-400" />
                    <span className="font-semibold">{repoData.repository.forks_count}</span>
                  </div>
                </div>
              </div>
              
              {repoData.repository.description && (
                <div className="mt-6 text-gray-300 bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                  {repoData.repository.description}
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Code className="h-5 w-5 text-green-400 mb-2" />
                  <span className="text-lg font-bold text-white">{repoData.repository.language || "N/A"}</span>
                  <span className="text-xs text-gray-400">Primary Language</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <GitBranch className="h-5 w-5 text-purple-400 mb-2" />
                  <span className="text-lg font-bold text-white">{repoData.repository.open_issues_count}</span>
                  <span className="text-xs text-gray-400">Open Issues</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-white">{formatDate(repoData.repository.created_at)}</span>
                  <span className="text-xs text-gray-400">Created</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Activity className="h-5 w-5 text-red-400 mb-2" />
                  <span className="text-sm font-medium text-white">{formatDate(repoData.repository.pushed_at)}</span>
                  <span className="text-xs text-gray-400">Last Updated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repository Topics */}
          {repoData.repository.topics && repoData.repository.topics.length > 0 && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {repoData.repository.topics.map((topic) => (
                  <span 
                    key={topic} 
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Commits */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-purple-400" />
              Recent Commits
            </h3>
            
            <div className="space-y-3">
              {repoData.commits.length > 0 ? (
                repoData.commits.slice(0, 5).map((commit) => (
                  <Card key={commit.sha} className="bg-gray-800/50 border-gray-700/30 hover:bg-gray-800/80 transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <a
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium flex items-center group"
                        >
                          <span className="text-xs text-gray-500 font-mono mr-2 bg-gray-700/50 px-2 py-0.5 rounded group-hover:bg-gray-700 transition-colors">
                            {commit.sha.substring(0, 7)}
                          </span>
                          <span className="text-sm truncate">{commit.commit.message.split("\n")[0]}</span>
                          <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{commit.commit.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(commit.commit.author.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No commits found
                </div>
              )}
            </div>
          </div>
          
          {/* AI Insights */}
          <div ref={insightsRef} className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </div>
              Repository Insights
            </h3>
            
            {insights ? (
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-5 text-gray-300 animate-in fade-in-50 duration-500">
                {insights.split("\n").map((line, i) => (
                  <p key={i} className={`${line.trim() === '' ? 'mb-4' : 'mb-3'} leading-relaxed`}>
                    {line}
                  </p>
                ))}
              </div>
            ) : insightsLoading ? (
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-8 flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-4" />
                <p className="text-gray-400">Analyzing repository data...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-8 text-center text-gray-400">
                No insights available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
