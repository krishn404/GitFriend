"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  icon?: ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function AnimatedButton({
  children,
  className,
  onClick,
  icon,
  variant = "default",
  size = "default",
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button className={cn("flex items-center gap-2", className)} onClick={onClick} variant={variant} size={size}>
        {children}
        {icon && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
          >
            {icon}
          </motion.div>
        )}
      </Button>
    </motion.div>
  )
}

