import { Inter } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"
import type React from "react" // Added import for React
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Git Helper",
  description: "An AI-powered web application that helps developers learn and troubleshoot Git and GitHub-related issues.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  themeColor: "#18181B",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  )
  
}

