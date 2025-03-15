"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="group relative my-4">
      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {language && <span className="text-xs font-mono text-gray-400">{language}</span>}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white"
            onClick={copyToClipboard}
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <div className="bg-gray-900 p-4 overflow-x-auto">
          <pre className="text-[14px] font-mono text-gray-300">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

