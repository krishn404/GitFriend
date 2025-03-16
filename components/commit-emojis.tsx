"use client"

import { Card } from "@/components/ui/card"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { useState } from "react"

export function CommitEmojis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)

  const filteredEmojis = EMOJIS.filter((emoji) => {
    const matchesSearch =
      emoji.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.emoji.includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "all" || emoji.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (text: string, emojiCode: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEmoji(emojiCode)
    setTimeout(() => setCopiedEmoji(null), 2000)
  }

  // Group categories for better organization
  const categoryGroups = {
    main: ["all", "added", "fixed", "improved", "removed", "security", "config", "docs", "ui"],
    emoji: ["people", "nature", "objects", "places", "symbols", "other"],
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <span className="text-xl">😊</span>
                <span>Git Commit Emojis</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Enhance your commit messages with expressive emojis</p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 md:w-80">
              <Input
                placeholder="Search emojis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background border-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Category Tabs - Main categories */}
          <div className="mb-6 overflow-x-auto scrollbar-thin pb-2">
            <div className="inline-flex flex-nowrap min-w-full">
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-lg h-auto flex flex-wrap">
                  <div className="flex flex-nowrap gap-1 p-1">
                    {categoryGroups.main.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="px-3 py-1.5 data-[state=active]:bg-background rounded-md transition-all text-xs sm:text-sm capitalize whitespace-nowrap"
                      >
                        {category === "all" ? "All" : category}
                      </TabsTrigger>
                    ))}
                  </div>
                  <div className="h-6 mx-2 border-r border-border hidden sm:block" />
                  <div className="flex flex-nowrap gap-1 p-1">
                    {categoryGroups.emoji.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="px-3 py-1.5 data-[state=active]:bg-background rounded-md transition-all text-xs sm:text-sm capitalize whitespace-nowrap"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            {filteredEmojis.length} {filteredEmojis.length === 1 ? "emoji" : "emojis"} found
            {activeCategory !== "all" && ` in category "${activeCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Emoji Grid */}
          {filteredEmojis.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredEmojis.map((emoji) => (
                <motion.div
                  key={emoji.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredEmoji(emoji.code)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  <Card
                    className={`bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors group overflow-hidden ${hoveredEmoji === emoji.code ? "ring-1 ring-primary/50" : ""}`}
                  >
                    <div className="p-3 flex flex-col items-center text-center relative">
                      <div
                        className="text-3xl mb-2 cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
                        onClick={() => copyToClipboard(emoji.emoji, `${emoji.code}-emoji`)}
                      >
                        {emoji.emoji}
                      </div>
                      <div
                        className="text-xs font-mono text-primary mb-1 cursor-pointer group/code relative"
                        onClick={() => copyToClipboard(emoji.code, `${emoji.code}-code`)}
                      >
                        <span className="relative z-10 hover:text-white transition-colors duration-200">
                          {emoji.code}
                        </span>
                        <span className="absolute inset-0 bg-primary scale-x-0 group-hover/code:scale-x-100 transition-transform duration-200 origin-left rounded-sm -z-0" />
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{emoji.description}</div>

                      {/* Category badge */}
                      <div className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-background/50 text-muted-foreground">
                        {emoji.category}
                      </div>

                      {/* Copy feedback */}
                      {copiedEmoji === `${emoji.code}-emoji` && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                            <Check className="h-3 w-3" />
                            <span>Copied emoji!</span>
                          </div>
                        </motion.div>
                      )}
                      {copiedEmoji === `${emoji.code}-code` && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                            <Check className="h-3 w-3" />
                            <span>Copied code!</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg font-medium">No emojis found</p>
                <p className="text-sm mt-1">Try adjusting your search or category filter</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("all")
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <h3 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Quick Reference</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium">New Features</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Use ✨ <code className="text-xs bg-muted px-1 rounded">:sparkles:</code> for new features
            </p>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🐛</span>
              <span className="text-sm font-medium">Bug Fixes</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Use 🐛 <code className="text-xs bg-muted px-1 rounded">:bug:</code> for bug fixes
            </p>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📝</span>
              <span className="text-sm font-medium">Documentation</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Use 📝 <code className="text-xs bg-muted px-1 rounded">:memo:</code> for documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

