"use client"

import { useState } from "react"
import { Bot, Send, User, Loader2, GitBranch, GitPullRequest, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { CodeBlock } from "./code-block"
import { SuggestionCard } from "./suggestion-card"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const suggestions = [
    {
      icon: GitBranch,
      title: "Git Branching",
      subtitle: "Learn advanced workflows",
    },
    {
      icon: GitPullRequest,
      title: "Pull Requests",
      subtitle: "Collaboration basics",
    },
    {
      icon: GitCommit,
      title: "Best Practices",
      subtitle: "Write better code",
    },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const text = await response.text()
      setMessages((prev) => [...prev, { role: "assistant", content: text }])
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
    <div className="glass-container w-full max-w-[1200px] mx-auto rounded-3xl overflow-hidden">
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center px-4 py-20"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="bg-primary/10 p-4 rounded-full mb-6"
                >
                  <Bot className="w-12 h-12" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-semibold mb-2"
                >
                  Hi, Developer
                </motion.h2>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl mb-3"
                >
                  Can I help you with anything?
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-8 max-w-md"
                >
                  Ready to assist you with Git and GitHub questions, from basic commands to advanced workflows.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <SuggestionCard
                        {...suggestion}
                        onClick={() => {
                          setInput(`Tell me about ${suggestion.title.toLowerCase()}`)
                          handleSubmit({ preventDefault: () => {} } as any)
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${message.role === "assistant" ? "bg-muted/30 rounded-lg p-4" : "p-4"}`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="w-6 h-6 mt-1 flex-shrink-0" />
                      ) : (
                        <User className="w-6 h-6 mt-1 flex-shrink-0" />
                      )}
                      <div className="prose dark:prose-invert max-w-none flex-1">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || "")
                              if (!inline && match) {
                                return <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />
                              }
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                            a({ href, children }) {
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 no-underline"
                                >
                                  {children}
                                </a>
                              )
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 bg-muted/30 rounded-lg p-4"
                  >
                    <Bot className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Thinking...
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-[#252525] dark:border-[#252525]"
        >
          <form onSubmit={handleSubmit} className="flex gap-3 items-center max-w-3xl mx-auto">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Git..."
              className="flex-1 min-h-[44px] resize-none bg-[#f5f5f5] dark:bg-[#141414] border-0 focus:ring-0 rounded-xl text-[14px] placeholder:text-black/40 dark:placeholder:text-white/40"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
