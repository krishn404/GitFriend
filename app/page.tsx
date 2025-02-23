import { Chat } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="absolute top-4 right-4">
        {/* <ThemeToggle /> */}
      </div>
      <Chat />
    </main>
  )
}
