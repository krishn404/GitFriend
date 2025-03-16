"use client"

import { GitHubProfile } from "@/components/github/github-profile"
import { CommitGenerator } from "@/components/github/commit-generator"
import { RepoAnalyzer } from "@/components/github/repo-analyzer"
import { CommitEmojis } from "@/components/github/commit-emojis" // Add this import
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, User, FileCode, ArrowLeft, Smile } from "lucide-react" // Add Smile icon
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { motion } from "framer-motion"

export default function GitHubPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <h1 className="text-xl font-medium text-foreground">GitHub Tools</h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Background effects */}
          <div className="relative">
            <motion.div
              className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl opacity-50"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 5 }}
            />

            {/* Main content */}
            <div className="relative bg-card/30 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-sm">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full flex justify-between p-1 bg-muted/50 border-b border-border rounded-t-xl rounded-b-none h-16">
                  <TabsTrigger
                    value="profile"
                    className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all hover:bg-muted/80 group"
                  >
                    <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline font-medium">Profile Explorer</span>
                    <span className="sm:hidden font-medium">Profiles</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="repository"
                    className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all hover:bg-muted/80 group"
                  >
                    <GitBranch className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline font-medium">Repository Analyzer</span>
                    <span className="sm:hidden font-medium">Repos</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="commit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all hover:bg-muted/80 group"
                  >
                    <FileCode className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline font-medium">Commit Generator</span>
                    <span className="sm:hidden font-medium">Commits</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="emojis"
                    className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all hover:bg-muted/80 group"
                  >
                    <Smile className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline font-medium">Commit Emojis</span>
                    <span className="sm:hidden font-medium">Emojis</span>
                  </TabsTrigger>
                </TabsList>

                <div className="p-4 sm:p-6">
                  <TabsContent value="profile" className="mt-0 animate-in fade-in-50 duration-300">
                    <GitHubProfile />
                  </TabsContent>

                  <TabsContent value="repository" className="mt-0 animate-in fade-in-50 duration-300">
                    <RepoAnalyzer />
                  </TabsContent>

                  <TabsContent value="commit" className="mt-0 animate-in fade-in-50 duration-300">
                    <CommitGenerator />
                  </TabsContent>

                  <TabsContent value="emojis" className="mt-0 animate-in fade-in-50 duration-300">
                    <CommitEmojis />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}

