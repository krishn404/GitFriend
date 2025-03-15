"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
// import { ThemeToggle } from "@/components/theme-toggle"
import { Github, MessageSquare, GitBranch, Code, ArrowRight, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to chat if already logged in
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
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/3 w-72 h-72 bg-cyan-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "25s" }}
          ></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6 text-white" />
            <span className="text-xl font-bold">Git Friend</span>
          </div>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your AI-Powered{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Git Assistant
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Get instant help with Git commands, GitHub workflows, and repository management. Powered by advanced AI
                to make your development experience smoother.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg rounded-xl flex items-center gap-2"
                  onClick={() => router.push("/login")}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 h-12 px-8 text-lg rounded-xl"
                  onClick={() => window.open("https://github.com/krishn404/gitchat", "_blank")}
                >
                  View on GitHub
                  <Github className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl filter blur-xl opacity-30"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">Git Friend Chat</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl py-3 px-4 self-end text-white w-fit max-w-[80%] ml-auto">
                    How do I resolve merge conflicts in Git?
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 w-fit max-w-[80%]">
                    <p className="text-gray-300">To resolve merge conflicts in Git, follow these steps:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-300">
                      <li>
                        Run <code className="bg-gray-700 px-1 rounded text-sm">git status</code> to identify conflicted
                        files
                      </li>
                      <li>
                        Open the files and look for conflict markers{" "}
                        <code className="bg-gray-700 px-1 rounded text-sm">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>
                      </li>
                      <li>Edit the files to resolve conflicts</li>
                      <li>
                        Add the resolved files with <code className="bg-gray-700 px-1 rounded text-sm">git add</code>
                      </li>
                      <li>
                        Complete the merge with <code className="bg-gray-700 px-1 rounded text-sm">git commit</code>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-16 md:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Git Friend combines AI intelligence with developer tools to make your Git workflow seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center mb-5">
                <MessageSquare className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Chat Assistant</h3>
              <p className="text-gray-400">
                Get instant answers to all your Git and GitHub questions with our advanced AI chat assistant.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center mb-5">
                <Github className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">GitHub Integration</h3>
              <p className="text-gray-400">
                Analyze GitHub profiles and repositories, generate commit messages, and get insights about trending
                projects.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-green-600/20 flex items-center justify-center mb-5">
                <Code className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Command Helper</h3>
              <p className="text-gray-400">
                Never forget a Git command again. Get syntax help, examples, and best practices for any Git operation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-yellow-600/20 flex items-center justify-center mb-5">
                <GitBranch className="h-7 w-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Workflow Guidance</h3>
              <p className="text-gray-400">
                Learn best practices for branching strategies, pull requests, and collaborative development workflows.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-red-600/20 flex items-center justify-center mb-5">
                <Star className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trending Repositories</h3>
              <p className="text-gray-400">
                Stay updated with trending GitHub repositories and discover new projects in your favorite programming
                languages.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-900/70 transition-all hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 rounded-xl bg-cyan-600/20 flex items-center justify-center mb-5">
                <MessageSquare className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Error Troubleshooting</h3>
              <p className="text-gray-400">
                Paste your Git error messages and get instant solutions and explanations to fix common issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Supercharge Your Git Workflow?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Join thousands of developers who use Git Friend to streamline their development process and become Git
                experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg rounded-xl flex items-center gap-2"
                onClick={() => router.push("/login")}
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 h-12 px-8 text-lg rounded-xl"
                onClick={() => {
                  const element = document.getElementById("features")
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-black/40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Github className="h-5 w-5 text-white" />
              <span className="text-lg font-bold">Git Friend</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Git Friend. Developed by{" "}
              <a href="https://github.com/krishn404" className="text-blue-400 hover:text-blue-300">
                Krishna
              </a>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://github.com/krishn404/gitchat" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

