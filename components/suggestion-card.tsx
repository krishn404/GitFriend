import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SuggestionCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  onClick?: () => void
}

export function SuggestionCard({ icon: Icon, title, subtitle, onClick }: SuggestionCardProps) {
  return (
    <div 
      className="suggestion-card cursor-pointer p-4" 
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="icon-container w-8 h-8 flex items-center justify-center mb-3">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-medium text-[14px] mb-1">{title}</h3>
        <p className="text-[13px] text-secondary">{subtitle}</p>
      </div>
    </div>
  )
}
