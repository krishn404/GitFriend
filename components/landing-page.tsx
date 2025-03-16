"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github, MessageSquare, GitBranch, Code, ArrowRight, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to chat if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  // Add these animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
          <p className="text-foreground text-base">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Update background elements with lighter colors */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/3 w-72 h-72 bg-cyan-500/5 dark:bg-cyan-600/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDuration: "25s" }}
          ></div>
        </motion.div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-xl font-bold">Git Friend</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Update Hero Section */}
      <section className="relative z-10 px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your AI-Powered{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Git Assistant
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl">
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
                  className="border-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-12 px-8 text-lg rounded-xl"
                  onClick={() => window.open("https://github.com/krishn404/gitchat", "_blank")}
                >
                  View on GitHub
                  <Github className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl filter blur-xl"></div>
              <div className="relative bg-white dark:bg-card/50 backdrop-blur-md border border-gray-200 dark:border-border rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">Git Friend Chat</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl py-3 px-4 self-end text-gray-900 dark:text-foreground w-fit max-w-[80%] ml-auto">
                    How do I resolve merge conflicts in Git?
                  </div>
                  <div className="bg-gray-50 dark:bg-muted/30 border border-gray-200 dark:border-border rounded-2xl p-4 w-fit max-w-[80%]">
                    <p className="text-gray-900 dark:text-foreground">To resolve merge conflicts in Git, follow these steps:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600 dark:text-muted-foreground">
                      <li>
                        Run <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 rounded text-sm">git status</code> to identify conflicted
                        files
                      </li>
                      <li>
                        Open the files and look for conflict markers{" "}
                        <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 rounded text-sm">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>
                      </li>
                      <li>Edit the files to resolve conflicts</li>
                      <li>
                        Add the resolved files with <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 rounded text-sm">git add</code>
                      </li>
                      <li>
                        Complete the merge with <code className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 rounded text-sm">git commit</code>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Update Features Section */}
      <section id="features" className="relative z-10 px-6 py-16 md:py-24 bg-muted/20">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Git Friend combines AI intelligence with developer tools to make your Git workflow seamless
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center mb-5">
                <MessageSquare className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI Chat Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant answers to all your Git and GitHub questions with our advanced AI chat assistant.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center mb-5">
                <Github className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">GitHub Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze GitHub profiles and repositories, generate commit messages, and get insights about trending
                projects.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-green-600/20 flex items-center justify-center mb-5">
                <Code className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Command Helper</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Never forget a Git command again. Get syntax help, examples, and best practices for any Git operation.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-yellow-600/20 flex items-center justify-center mb-5">
                <GitBranch className="h-7 w-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Workflow Guidance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn best practices for branching strategies, pull requests, and collaborative development workflows.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-red-600/20 flex items-center justify-center mb-5">
                <Star className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Trending Repositories</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with trending GitHub repositories and discover new projects in your favorite programming
                languages.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              className="bg-white dark:bg-card/50 shadow-lg dark:shadow-none backdrop-blur-md border border-gray-200 dark:border-border rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-card/80 transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-cyan-600/20 flex items-center justify-center mb-5">
                <MessageSquare className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Error Troubleshooting</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Paste your Git error messages and get instant solutions and explanations to fix common issues.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Update CTA Section */}
      <section className="relative z-10 px-6 py-16 md:py-24">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white dark:bg-gradient-to-r dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-lg border border-gray-200 dark:border-border rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Supercharge Your Git Workflow?</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-gray-50 dark:bg-muted/20 border-t border-gray-200 dark:border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Github className="h-5 w-5 text-gray-900 dark:text-white" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">Git Friend</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Git Friend. Developed by{" "}
              <a href="https://github.com/krishn404" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
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

