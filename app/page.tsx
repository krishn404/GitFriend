import { Chat } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Chat />
    </main>
  )
}

