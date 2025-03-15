"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
// import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Github, LogOut, Mail, Calendar, MessageSquare } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { formatDistanceToNow } from "date-fns"
import { useMemo } from "react"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  // Create avatar with first letter of display name as fallback
  const avatarFallback = useMemo(() => {
    if (!user) return null
    return user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"
  }, [user])

  if (!user) {
    return null
  }

  const creationTime = user.metadata.creationTime
    ? formatDistanceToNow(new Date(user.metadata.creationTime), { addSuffix: true })
    : "Unknown"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
        {/* Subtle animated background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "25s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "30s" }}
          ></div>
        </div>

        <div className="container max-w-4xl mx-auto py-8 px-4 relative z-10">
          {/* Header with back button and theme toggle */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </Link>
            {/* <ThemeToggle /> */}
          </div>

          {/* Profile card */}
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
            {/* Profile header with gradient */}
            <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

            <div className="px-8 pb-8 -mt-16">
              {/* Avatar and basic info */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800 mb-4 shadow-xl">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL?.replace("s96-c", "s400-c") || "/placeholder.svg"}
                      alt={user.displayName || "User"}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.parentElement!.classList.add(
                          "flex",
                          "items-center",
                          "justify-center",
                          "bg-blue-600",
                        )
                        e.currentTarget.parentElement!.innerHTML =
                          `<span class="text-4xl font-bold text-white">${avatarFallback}</span>`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{avatarFallback}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white text-center">{user.displayName || "Anonymous User"}</h1>
                {user.email && (
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                )}

                {/* Auth provider badge */}
                <div className="mt-4 px-3 py-1.5 bg-gray-800/70 rounded-full flex items-center gap-2">
                  {user.providerData[0]?.providerId.includes("github") ? (
                    <>
                      <Github className="h-4 w-4 text-white" />
                      <span className="text-sm text-gray-300">GitHub Account</span>
                    </>
                  ) : user.providerData[0]?.providerId.includes("google") ? (
                    <>
                      <FaGoogle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-300">Google Account</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-300">
                      {user.providerData[0]?.providerId || "Unknown"} Account
                    </span>
                  )}
                </div>
              </div>

              {/* Account info */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Account Created</p>
                      <p className="text-white">{creationTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Chat Sessions</p>
                      <p className="text-white">12 sessions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/"
                    className="group flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Chat</p>
                      <p className="text-gray-400 text-sm">Continue your Git conversation</p>
                    </div>
                  </Link>

                  <Link
                    href="/github"
                    className="group flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <Github className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">GitHub Tools</p>
                      <p className="text-gray-400 text-sm">Analyze profiles and repositories</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Sign out button */}
              <Button
                onClick={logout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 h-12 rounded-xl transition-all"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Git Friend • Developed by{" "}
              <a href="https://github.com/krishn404" className="text-blue-400 hover:text-blue-300 transition-colors">
                Krishna
              </a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

