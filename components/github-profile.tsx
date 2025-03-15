"use client"

import { useState, useRef } from "react"
import type { GitHubUser, GitHubRepo } from "@/lib/github-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Star, GitFork, Code, ExternalLink, Calendar, Users, BookOpen, Loader2 } from 'lucide-react'
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
        insightsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error("Error generating insights:", err)
    } finally {
      setInsightsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter GitHub username (e.g., octocat)"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="bg-gray-800/50 border-gray-700/50 text-white pl-10 h-12 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchUserData()
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button 
          onClick={fetchUserData} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-xl"
        >
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

      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}

      {loading && !userData && (
        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
          <div className="w-24 h-24 bg-gray-700/50 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-700/50 rounded-full mb-2"></div>
          <div className="h-4 w-32 bg-gray-700/50 rounded-full"></div>
        </div>
      )}

      {userData && (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl border-4 border-gray-900 overflow-hidden">
                    <Image 
                      src={userData.user.avatar_url || "/placeholder.svg"} 
                      alt={`${userData.user.login}'s avatar`}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-2xl font-bold text-white">{userData.user.name || userData.user.login}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <a
                      href={userData.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-400 transition-colors"
                    >
                      @{userData.user.login}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
                <a
                  href={userData.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              {userData.user.bio && (
                <div className="mt-6 text-gray-300 bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                  {userData.user.bio}
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-400 mb-2" />
                  <span className="text-xl font-bold text-white">{userData.user.public_repos}</span>
                  <span className="text-xs text-gray-400">Repositories</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Users className="h-5 w-5 text-green-400 mb-2" />
                  <span className="text-xl font-bold text-white">{userData.user.followers}</span>
                  <span className="text-xs text-gray-400">Followers</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Users className="h-5 w-5 text-purple-400 mb-2" />
                  <span className="text-xl font-bold text-white">{userData.user.following}</span>
                  <span className="text-xs text-gray-400">Following</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:bg-gray-800 transition-colors">
                  <Calendar className="h-5 w-5 text-yellow-400 mb-2" />
                  <span className="text-sm font-medium text-white">{formatDate(userData.user.created_at)}</span>
                  <span className="text-xs text-gray-400">Joined</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repositories */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Top Repositories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.repositories.length > 0 ? (
                userData.repositories.map((repo) => (
                  <Card key={repo.id} className="bg-gray-800/50 border-gray-700/30 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
                        >
                          {repo.name}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center text-xs text-gray-400">
                            <Star className="h-3 w-3 mr-1 text-yellow-400" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center text-xs text-gray-400">
                            <GitFork className="h-3 w-3 mr-1 text-blue-400" />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>
                      
                      {repo.description && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{repo.description}</p>
                      )}
                      
                      <div className="flex items-center mt-3 gap-3">
                        {repo.language && (
                          <span className="flex items-center text-xs px-2 py-1 bg-gray-700/50 rounded-full">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  No public repositories found
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
              Profile Insights
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
                <p className="text-gray-400">Analyzing profile and repositories...</p>
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
