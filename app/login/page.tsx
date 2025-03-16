"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Github, ArrowLeft } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/chat")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          ></motion.div>
          <p className="text-foreground text-lg">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.6, 0.5],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          ></motion.div>
        </div>
      </div>

      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Link
          href="/"
          className="fixed top-6 left-6 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
      </motion.div>

      <motion.div
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card */}
        <motion.div
          className="relative bg-card backdrop-blur-lg border border-border rounded-2xl p-8 shadow-xl overflow-hidden"
          whileHover={{ boxShadow: "0 20px 80px -20px rgba(66, 71, 255, 0.3)" }}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 filter blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          ></motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full -translate-x-1/2 translate-y-1/2 filter blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          ></motion.div>

          {/* Content */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <motion.div
              className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 border-2 border-primary/30 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Github className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-foreground text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-3 text-center max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Sign in to continue your Git journey with AI-powered assistance.
            </motion.p>
          </div>

          <div className="space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full h-12 bg-background text-foreground flex items-center justify-center gap-3 rounded-xl transition-all shadow-sm"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Sign in with Google</span>
              </Button>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={signInWithGithub}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-xl transition-all shadow-sm"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">Sign in with GitHub</span>
              </Button>
            </motion.div> */}
          </div>

          <motion.div
            className="mt-8 text-center text-muted-foreground text-sm relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

