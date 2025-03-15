import { GitHubProfile } from "@/components/github-profile"
import { CommitGenerator } from "@/components/commit-generator"
import { RepoAnalyzer } from "@/components/repo-analyzer"
// import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, User, FileCode, Github, ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function GitHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
      <div className="container mx-auto py-6 px-4 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-300" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">GitHub Tools</h1>
          </div>
          {/* <ThemeToggle /> */}
        </div>
        
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl opacity-20"></div>
          
          <div className="relative bg-black/20 backdrop-blur-lg border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Github className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Explore GitHub with AI-powered tools</h2>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-gray-800/50 p-1 rounded-xl">
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gray-700 rounded-lg transition-all">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile Explorer</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="repository" className="flex items-center gap-2 data-[state=active]:bg-gray-700 rounded-lg transition-all">
                  <GitBranch className="h-4 w-4" />
                  <span className="hidden sm:inline">Repository Analyzer</span>
                  <span className="sm:hidden">Repos</span>
                </TabsTrigger>
                <TabsTrigger value="commit" className="flex items-center gap-2 data-[state=active]:bg-gray-700 rounded-lg transition-all">
                  <FileCode className="h-4 w-4" />
                  <span className="hidden sm:inline">Commit Generator</span>
                  <span className="sm:hidden">Commits</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="animate-in fade-in-50 duration-300">
                <GitHubProfile />
              </TabsContent>

              <TabsContent value="repository" className="animate-in fade-in-50 duration-300">
                <RepoAnalyzer />
              </TabsContent>

              <TabsContent value="commit" className="animate-in fade-in-50 duration-300">
                <CommitGenerator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
