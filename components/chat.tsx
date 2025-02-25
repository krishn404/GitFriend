"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Lightbulb, Upload, FileText, Zap, BarChart2, Image, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { CodeBlock } from "./code-block"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Convert URLs in text to badge-style links
  const LinkRenderer = ({ href, children }: { href?: string, children: React.ReactNode }) => {
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
    <div className="min-h-screen bg-[#18181B] flex flex-col">
      {/* Top Navigation - Minimal header */}
      <header className="p-4 sm:p-4 fixed top-0 left-0 right-0 z-10 bg-[#18181B]">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-semibold text-white">Git Friend</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area - Scrollable content */}
      <div className={`flex-1 flex flex-col items-center p-2 sm:p-4 w-full mt-14 ${messages.length > 0 ? 'mb-32 overflow-y-auto' : 'justify-center'}`}>
        <div className="w-full max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="text-center space-y-4 px-2 sm:px-4">
              <h1 className="text-2xl sm:text-4xl font-semibold text-white">{getGreeting()}</h1>
              <p className="text-lg sm:text-xl text-gray-400">How can I help you with Git and GitHub today?</p>
              
              {/* New Input Area for welcome screen - Centered */}
              <div className="mt-8 w-full max-w-3xl mx-auto">
                <div className="relative rounded-xl bg-[#27272A] p-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What do you want to know?"
                    className="w-full bg-transparent border-0 focus:ring-0 text-gray-300 placeholder-gray-500 resize-none py-2 px-2 min-h-[48px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  
                  {/* Action buttons */}
                  {/* <div className="flex justify-between items-center px-2 py-2 border-t border-gray-700 mt-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white p-2">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                        <Search className="w-4 h-4" />
                        <span className="text-xs">DeepSearch</span>
                      </Button>
                      <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs">Think</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                        <span className="text-xs">Grok 3</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-white p-2"
                        onClick={handleSubmit}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 7-7 7 7"></path>
                          <path d="M12 19V5"></path>
                        </svg>
                      </Button>
                    </div>
                  </div> */}
                </div>
                
                {/* Feature buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded-md">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Trending Repo</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded-md"
                    onClick={() => handleSubmitWithPrompt("Create a new repository")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Create Repo</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded-md"
                    onClick={() => handleSubmitWithPrompt("Provide all github commands")}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    <span>Commands</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-2 sm:px-0">
              {messages.map((message, i) => (
                <div key={i} className="flex gap-3 min-w-0">
                  {message.role === "assistant" ? (
                    <>
                      <div className="prose dark:prose-invert max-w-none flex-1 overflow-hidden">
                        {/* Add content counters when showing results */}

                        
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
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            },
                            div: ({ children }) => (
                              <div className="max-w-full overflow-x-hidden">
                                {children}
                              </div>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">
                                {children}
                              </h2>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-300 leading-7 break-words mb-4">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-2 mb-4">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-gray-300 leading-7 flex items-start">
                                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                                <span className="flex-1">{children}</span>
                              </li>
                            ),
                            a: ({ href, children }) => (
                              <LinkRenderer href={href}>
                                {children}
                              </LinkRenderer>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-white">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-800 rounded-xl py-2 px-4 self-end text-white w-fit max-w-[80%] ml-auto">
                      {message.content}
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
              <div className="animate-pulse flex items-center gap-2 text-gray-400">
                <span>Thinking...</span>
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
        <div className="fixed bottom-0 left-0 right-0 bg-[#18181B] border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-xl bg-[#27272A] p-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can Git Friend help?"
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-300 placeholder-gray-500 resize-none py-2 px-2 min-h-[48px] max-h-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              
              {/* Action buttons */}
              <div className="flex justify-between items-center px-2 py-2 border-t border-gray-700 mt-2">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white p-2">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                    <Search className="w-4 h-4" />
                    <span className="text-xs">DeepSearch</span>
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs">Think</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800">
                    <span className="text-xs">Grok 3</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white p-2"
                    onClick={handleSubmit}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 7-7 7 7"></path>
                      <path d="M12 19V5"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}