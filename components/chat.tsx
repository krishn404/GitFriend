"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FileText, Code, Github, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { CodeBlock } from "./code-block"

// Add these imports at the top
import { parseGitHubLink } from "@/lib/github-link-parser"
import { GitHubProfile } from "@/components/github-profile"
import { RepoAnalyzer } from "@/components/repo-analyzer"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children: React.ReactNode
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDots, setLoadingDots] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [animatedText, setAnimatedText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  // Add this state after the other state variables
  const [githubLink, setGithubLink] = useState<{ type: "profile" | "repository"; value: string } | null>(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add this useEffect for the dots animation
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setLoadingDots((dots) => (dots.length >= 3 ? "" : dots + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setGithubLink(null)

    // Check for GitHub links first
    const parsedLink = parseGitHubLink(input)
    if (parsedLink) {
      if (parsedLink.type === "profile") {
        setGithubLink({ type: "profile", value: parsedLink.owner })
        // Add a simple confirmation message
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: `Analyzing GitHub profile for ${parsedLink.owner}...` 
        }])
        setIsLoading(false)
        return // Don't proceed with AI chat
      } else if (parsedLink.type === "repository") {
        setGithubLink({ type: "repository", value: `${parsedLink.owner}/${parsedLink.repo}` })
        // Add a simple confirmation message
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: `Analyzing repository ${parsedLink.owner}/${parsedLink.repo}...` 
        }])
        setIsLoading(false)
        return // Don't proceed with AI chat
      }
    }

    // Continue with normal chat for non-GitHub link messages
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const text = await response.text()
      setAnimatedText("")
      setIsAnimating(true)

      // Add empty assistant message first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      // Animate the text word by word
      const words = text.split(/(\s+)/)
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30)) // Adjust speed here
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = words.slice(0, i + 1).join("")
          return newMessages
        })
        scrollToBottom()
      }

      setIsAnimating(false)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Convert URLs in text to badge-style links
  const LinkRenderer = ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (!href) return <>{children}</>

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800 text-blue-400 hover:bg-gray-700 transition-colors text-xs"
      >
        {children}
      </a>
    )
  }

  // Add this new function to handle the custom prompt
  async function handleSubmitWithPrompt(prompt: string) {
    const userMessage = { role: "user" as const, content: prompt }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setGithubLink(null) // Reset GitHub link

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const text = await response.text()
      setAnimatedText("")
      setIsAnimating(true)

      // Add empty assistant message first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      // Animate the text word by word
      const words = text.split(/(\s+)/)
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10)) // Adjust speed here
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = words.slice(0, i + 1).join("")
          return newMessages
        })
        scrollToBottom()
      }

      setIsAnimating(false)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex flex-col">
      {/* Top Navigation - Minimal header */}
      <header className="p-4 sm:p-4 fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#121212] to-transparent">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-white" />
            <span className="text-lg sm:text-xl font-semibold text-white">Git Friend</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area - Scrollable content */}
      <div
        className={`flex-1 flex flex-col items-center p-2 sm:p-4 w-full mt-14 ${messages.length > 0 ? "mb-32 overflow-y-auto" : "justify-center"}`}
      >
        <div className="w-full max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="text-center space-y-4 px-2 sm:px-4">
              <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl opacity-20"></div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white">{getGreeting()}</h1>
                <p className="text-lg sm:text-xl text-gray-400 mt-2">How can I help you with Git and GitHub today?</p>
              </div>

              {/* New Input Area for welcome screen - Centered */}
              <div className="mt-12 w-full max-w-3xl mx-auto">
                <div className="relative rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/5 p-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about Git or GitHub..."
                    className="w-full bg-transparent border-0 focus:ring-0 text-gray-300 placeholder-gray-500 resize-none py-3 px-3 min-h-[60px] text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </Button>
                </div>

                {/* Feature buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 transition-all"
                    onClick={() => handleSubmitWithPrompt("What are the trending repositories on GitHub right now?")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Trending Repos</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 transition-all"
                    onClick={() => handleSubmitWithPrompt("How do I create a new repository on GitHub?")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Create Repo</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 transition-all"
                    onClick={() => handleSubmitWithPrompt("What are the most common Git commands?")}
                  >
                    <Code className="h-4 w-4" />
                    <span>Commands</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 transition-all"
                    onClick={() => (window.location.href = "/github")}
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub Tools</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-2 sm:px-0">
              {messages.map((message, i) => (
                <div key={i} className="flex gap-3 min-w-0">
                  {message.role === "user" ? (
                    <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl py-3 px-4 self-end text-white w-fit max-w-[80%] ml-auto">
                      {message.content}
                    </div>
                  ) : (
                    <div className="w-full">
                      <div
                        className={`prose dark:prose-invert max-w-none flex-1 overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 ${
                          message.role === "assistant" ? "animate-in fade-in-50 duration-300" : ""
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            code({ inline, className, children, ...props }: CodeProps) {
                              const match = /language-(\w+)/.exec(className || "")
                              if (!inline && match) {
                                return (
                                  <div className="max-w-full overflow-x-auto">
                                    <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />
                                  </div>
                                )
                              }
                              return (
                                <code className={`${className} bg-gray-800 px-1.5 py-0.5 rounded text-sm`} {...props}>
                                  {children}
                                </code>
                              )
                            },
                            div: ({ children }) => <div className="max-w-full overflow-x-hidden">{children}</div>,
                            h1: ({ children }) => (
                              <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">{children}</h2>
                            ),
                            p: ({ children }) => <p className="text-gray-300 leading-7 break-words mb-4">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
                            li: ({ children }) => (
                              <li className="text-gray-300 leading-7 flex items-start">
                                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                                <span className="flex-1">{children}</span>
                              </li>
                            ),
                            a: ({ href, children }) => <LinkRenderer href={href}>{children}</LinkRenderer>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {/* Add GitHub link analysis after assistant message */}
                      {i === messages.length - 1 && githubLink && (
                        <div className="mt-4 w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                          <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
                            <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                              <Github className="h-5 w-5 text-blue-400" />
                              {githubLink.type === "profile" ? "GitHub Profile Analysis" : "Repository Analysis"}
                            </h3>
                            {githubLink.type === "profile" ? (
                              <GitHubProfile initialUsername={githubLink.value} />
                            ) : (
                              <RepoAnalyzer initialRepo={githubLink.value} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              {/* Add extra padding at the bottom to ensure content is not hidden */}
              <div className="h-4"></div>
            </div>
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Thinking{loadingDots}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Only show on welcome screen */}
      {messages.length === 0 && (
        <div className="text-center p-4 text-xs sm:text-sm text-gray-500">
          Developed by{" "}
          <a href="https://github.com/krishn404" className="text-gray-400 hover:text-white">
            Krishna
          </a>{" "}
          Open Source at{" "}
          <a href="https://github.com/krishn404/gitchat" className="text-gray-400 hover:text-white">
            Git Friend
          </a>
          .
        </div>
      )}

      {/* Sticky Input Area - Only when conversations are active */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#121212] to-transparent p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/5 p-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Git or GitHub..."
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-300 placeholder-gray-500 resize-none py-3 px-3 min-h-[60px] pr-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Send className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

