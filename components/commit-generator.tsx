"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, Copy, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'

export function CommitGenerator() {
  const [diff, setDiff] = useState("")
  const [commitMessage, setCommitMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateCommitMessage = async () => {
    if (!diff.trim()) {
      setError("Please enter code changes")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/github/generate-commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diff }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate commit message")
      }

      setCommitMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(commitMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/5 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <GitCommit className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">AI Commit Message Generator</CardTitle>
              <CardDescription className="text-gray-400">
                Paste your code diff and get an AI-generated commit message
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your git diff or code changes here..."
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="min-h-[200px] bg-gray-800/50 border-gray-700/50 text-gray-300 rounded-xl font-mono text-sm resize-y"
            />
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
              git diff
            </div>
          </div>

          {error && (
            <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              {error}
            </div>
          )}

          <Button 
            onClick={generateCommitMessage} 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Commit Message
              </>
            )}
          </Button>

          {commitMessage && (
            <div className="mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Generated Commit Message</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-gray-400 hover:text-white"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/30 p-4 rounded-xl text-gray-300 whitespace-pre-wrap font-mono text-sm">
                {commitMessage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tips for Good Commit Messages</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-gray-300">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">1</span>
            </div>
            <span>Use the imperative mood: "Add feature" not "Added feature"</span>
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">2</span>
            </div>
            <span>Keep the first line under 50 characters</span>
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">3</span>
            </div>
            <span>Explain what and why, not how</span>
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-bold text-blue-400">4</span>
            </div>
            <span>Add a blank line between the summary and detailed description</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
