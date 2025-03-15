"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <AuthProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </AuthProvider>
  )
}

