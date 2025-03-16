"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { GitCommit, Copy, Check, Loader2, AlertCircle, Sparkles } from "lucide-react"

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
      <Card className="bg-card border border-border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <GitCommit className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">AI Commit Message Generator</h3>
            <p className="text-sm text-muted-foreground">Paste your code diff and get an AI-generated commit message</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your git diff or code changes here..."
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="min-h-[180px] bg-background border-input text-foreground font-mono text-sm resize-y"
            />
            <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              git diff
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button onClick={generateCommitMessage} disabled={loading} className="w-full h-10">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <div className="mt-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">Generated Commit Message</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground hover:text-foreground"
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
              <div className="bg-muted/30 border border-border/50 p-3 rounded-lg text-foreground whitespace-pre-wrap font-mono text-sm">
                {commitMessage}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-card border border-border p-4 sm:p-6">
        <h3 className="text-base font-medium text-foreground mb-3">Tips for Good Commit Messages</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">1</span>
            </div>
            <span>Use the imperative mood: "Add feature" not "Added feature"</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">2</span>
            </div>
            <span>Keep the first line under 50 characters</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">3</span>
            </div>
            <span>Explain what and why, not how</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">4</span>
            </div>
            <span>Add a blank line between the summary and detailed description</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

