"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Github, LogOut, Mail, User, Calendar, LinkIcon } from "lucide-react"
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
        <div className="container mx-auto py-6 px-4 sm:py-12">
          {/* Header with back button and theme toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-300" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Profile</h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Main content */}
          <div className="relative">
            {/* Background effects */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl opacity-20"></div>

            <div className="relative bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile picture and logout button */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-800 mb-4 relative bg-gray-800">
                    {user.photoURL ? (
                      <div className="w-full h-full relative">
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
                      </div>
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{avatarFallback}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="mt-4 w-full flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>

                {/* User information */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.displayName || "Anonymous User"}</h2>
                    {user.email && (
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* User stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700/30 hover:bg-gray-800/70 transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Account Created</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{creationTime}</span>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/30 hover:bg-gray-800/70 transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Authentication Provider</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2">
                        {user.providerData[0]?.providerId.includes("github") ? (
                          <>
                            <Github className="h-4 w-4 text-white" />
                            <span className="text-white">GitHub</span>
                          </>
                        ) : user.providerData[0]?.providerId.includes("google") ? (
                          <>
                            <FaGoogle className="h-4 w-4 text-red-400" />
                            <span className="text-white">Google</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-white">{user.providerData[0]?.providerId || "Unknown"}</span>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Navigation links */}
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
                    <div className="space-y-3">
                      <Link
                        href="/"
                        className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all hover:translate-x-1 duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Github className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <span className="text-white font-medium">Return to Chat</span>
                            <p className="text-gray-500 text-sm">Continue your Git conversation</p>
                          </div>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                      </Link>

                      <Link
                        href="/github"
                        className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all hover:translate-x-1 duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <LinkIcon className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <span className="text-white font-medium">GitHub Tools</span>
                            <p className="text-gray-500 text-sm">Analyze profiles and repositories</p>
                          </div>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

