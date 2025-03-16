"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Github, LogOut, Mail, Calendar, MessageSquare } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { formatDistanceToNow } from "date-fns"
import { useMemo } from "react"
import { motion } from "framer-motion"

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
      <div className="min-h-screen bg-background">
        {/* Subtle animated background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          ></motion.div>
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 5 }}
          ></motion.div>
        </div>

        <div className="container max-w-4xl mx-auto py-8 px-4 relative z-10">
          {/* Header with back button and theme toggle */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Profile card */}
          <motion.div
            className="bg-card border border-border rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile header with gradient */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>

            <div className="px-8 pb-8 -mt-16">
              {/* Avatar and basic info */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted mb-4 shadow-xl">
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
                          "bg-primary",
                        )
                        e.currentTarget.parentElement!.innerHTML =
                          `<span class="text-4xl font-bold text-primary-foreground">${avatarFallback}</span>`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-foreground">{avatarFallback}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground text-center">
                  {user.displayName || "Anonymous User"}
                </h1>
                {user.email && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                )}

                {/* Auth provider badge */}
                <div className="mt-4 px-3 py-1.5 bg-muted rounded-full flex items-center gap-2">
                  {user.providerData[0]?.providerId.includes("github") ? (
                    <>
                      <Github className="h-4 w-4 text-foreground" />
                      <span className="text-sm text-muted-foreground">GitHub Account</span>
                    </>
                  ) : user.providerData[0]?.providerId.includes("google") ? (
                    <>
                      <FaGoogle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">Google Account</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {user.providerData[0]?.providerId || "Unknown"} Account
                    </span>
                  )}
                </div>
              </div>

              {/* Account info */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>
                <div className="bg-muted border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                      <p className="text-foreground">{creationTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Chat Sessions</p>
                      <p className="text-foreground">12 sessions</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick links */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/"
                    className="group flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 border border-border rounded-2xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Chat</p>
                      <p className="text-muted-foreground text-sm">Continue your Git conversation</p>
                    </div>
                  </Link>

                  <Link
                    href="/github"
                    className="group flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 border border-border rounded-2xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Github className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">GitHub Tools</p>
                      <p className="text-muted-foreground text-sm">Analyze profiles and repositories</p>
                    </div>
                  </Link>
                </div>
              </motion.div>

              {/* Sign out button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={logout} variant="destructive" className="w-full h-12 rounded-xl transition-all">
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>
              Git Friend • Developed by{" "}
              <a href="https://github.com/krishn404" className="text-primary hover:text-primary/80 transition-colors">
                Krishna
              </a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

