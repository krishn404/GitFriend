import { Chat } from "@/components/chat"
import ProtectedRoute from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Chat />
      </main>
    </ProtectedRoute>
  )
}

