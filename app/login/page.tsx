"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-4">
      <div className="relative w-full max-w-md">
        {/* Background effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full filter blur-3xl"></div>

        {/* Card */}
        <div className="relative bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 filter blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full -translate-x-1/2 translate-y-1/2 filter blur-2xl"></div>

          {/* Content */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 border-2 border-blue-500/30 shadow-lg">
              <Github className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white text-center">Welcome to Git Friend</h1>
            <p className="text-gray-400 mt-3 text-center max-w-xs">
              Your AI-powered Git and GitHub assistant. Sign in to get started.
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 bg-white hover:bg-gray-100 text-gray-800 flex items-center justify-center gap-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-md"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="font-medium">Sign in with Google</span>
            </Button>

            <Button
              onClick={signInWithGithub}
              className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-md border border-white/10"
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">Sign in with GitHub</span>
            </Button>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm relative z-10">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  )
}

