import { Chat } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-6 h-6" />
            <h1 className="text-xl font-bold">Git Helper AI</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Git & GitHub Assistant</h2>
            <p className="text-muted-foreground">
              Get help with Git commands, fix errors, and learn best practices with AI-powered assistance
            </p>
          </div>
          <Chat />
        </div>
      </div>
    </main>
  )
}

