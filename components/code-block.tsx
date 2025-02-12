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
      <div className="bg-[#141414] rounded-xl p-6">
        <div className="bg-[#1c1c1c] rounded-lg p-4 overflow-x-auto">
          <pre className="text-[14px] font-mono text-white/90">
            <code>{code}</code>
          </pre>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-8 right-8 h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" 
          onClick={copyToClipboard}
        >
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white/80" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
    </div>
  )
}