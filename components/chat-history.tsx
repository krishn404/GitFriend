"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { History, Trash2, MessageSquare, Plus, Loader2, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface ChatSession {
  sessionId: string
  title: string
  createdAt: string
  updatedAt: string
}

export function ChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchChatSessions()
  }, [])

  const fetchChatSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/chat-history")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch chat history")
      }

      setSessions(data.sessions)
    } catch (err) {
      console.error("Error fetching chat history:", err)
      setError("Failed to load chat history")
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      setDeletingId(sessionId)
      const response = await fetch(`/api/chat-history/${sessionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete chat session")
      }

      setSessions(sessions.filter((session) => session.sessionId !== sessionId))
    } catch (err) {
      console.error("Error deleting chat session:", err)
      setError("Failed to delete chat session")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const startNewChat = () => {
    setIsOpen(false)
    router.push("/")
  }

  return (
    <div className="relative z-20">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted/80 transition-colors"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-muted-foreground" />
        ) : (
          <History className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>

      <div
        className={`fixed inset-0 bg-background/50 backdrop-blur-sm z-20 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <motion.div
        className={`fixed left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-md border-r border-border shadow-xl z-30 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Chat History
            </h2>
            <Button
              onClick={startNewChat}
              variant="ghost"
              className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
              <p className="text-muted-foreground text-sm">Loading chat history...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p>No chat history found</p>
              <p className="text-sm mt-1">Start a new conversation</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {sessions.map((session) => (
                <Card key={session.sessionId} className="bg-muted/50 hover:bg-muted border-border transition-colors">
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/chat/${session.sessionId}`}
                        className="flex-1 text-foreground hover:text-foreground/90 font-medium truncate"
                        onClick={() => setIsOpen(false)}
                      >
                        {session.title}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          deleteSession(session.sessionId)
                        }}
                        disabled={deletingId === session.sessionId}
                      >
                        {deletingId === session.sessionId ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(session.updatedAt)}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

