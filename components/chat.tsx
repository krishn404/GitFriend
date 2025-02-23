"use client"

import { useState } from "react"
import { Search, LightbulbIcon, BarChart2, Image, Code,  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { CodeBlock } from "./code-block"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Add this type definition for the code component props
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
  const [isResourceOpen, setIsResourceOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

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

  const handleResourceClick = (href: string | undefined) => {
    if (href) {
      setSelectedResource(href)
      setSheetOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#18181B] flex flex-col">
      {/* Top Navigation */}
      <header className="p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-white">Git Friend</span>
          </div>
          
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-3xl space-y-4 mb-24">
          {messages.length === 0 ? (
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-semibold text-white">Welcome to Git Friend</h1>
              <p className="text-xl text-gray-400">Ask me anything about Git & GitHub!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div key={i} className="flex gap-3">
                  {message.role === "assistant" ? (
                    <>
                      <div className="w-6 h-6 mt-1 flex-shrink-0">
                        <div className="w-6 h-6">
                          {/* Assistant icon here */}
                        </div>
                      </div>
                      <div className="prose dark:prose-invert max-w-none flex-1">
                        <ReactMarkdown
                          components={{
                            code({ inline, className, children, ...props }: CodeProps) {
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
                            p: ({ children }) => <p className="text-gray-300 leading-7">{children}</p>,
                            h1: ({ children }) => <h1 className="text-xl font-semibold text-white mb-4">{children}</h1>,
                            li: ({ children }) => (
                              <li className="text-gray-300 mb-2">
                                {typeof children === 'string' && children.includes(' - ') ? (
                                  <>
                                    <strong className="text-white">{children.split(' - ')[0]}</strong>
                                    {' - ' + children.split(' - ')[1]}
                                  </>
                                ) : children}
                              </li>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        
                        {/* Resource badges at the bottom of the message */}

                      </div>
                    </>
                  ) : (
                    <div className="w-6 h-6 mt-1 flex-shrink-0">
                      {/* User icon here */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-6 h-6 mt-1 flex-shrink-0">
                <div className="w-6 h-6">
                  {/* Loading spinner icon */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  {/* Loading spinner */}
                </div>
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Made sticky */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#18181B] border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Git commands, workflows, or best practices..."
              className="w-full bg-[#27272A] rounded-xl pl-12 py-3 min-h-[48px] resize-none border-0 focus:ring-0 text-gray-300 placeholder:text-gray-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Developed by{" "}
            <a href="https://github.com/krishn404" className="text-gray-400 hover:text-white">Krishna</a> Open Source at{" "}
            <a href="https://github.com/krishn404/gitchat" className="text-gray-400 hover:text-white">Git Friend</a>.
          </div>
        </div>
      </div>

      {/* Add a Sheet component for the sidebar */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] bg-[#18181B] border-l border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Resource Details</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {selectedResource && (
              <div className="text-gray-300">
                <p>Resource URL: {selectedResource}</p>
                {/* Add more resource details here as needed */}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}