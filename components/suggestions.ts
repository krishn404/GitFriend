import { GitBranch, GitPullRequest, GitCommit } from "lucide-react";

export interface Suggestion {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

export function getDynamicSuggestions(): Suggestion[] {
  // Here you can implement logic to fetch or generate dynamic suggestions
  const suggestions: Suggestion[] = [
    {
      icon: GitBranch,
      title: "Git Branching",
      subtitle: "Learn advanced workflows",
    },
    {
      icon: GitPullRequest,
      title: "Pull Requests",
      subtitle: "Collaboration basics",
    },
    {
      icon: GitCommit,
      title: "Best Practices",
      subtitle: "Write better code",
    },
  ];

  // You can add logic to refresh suggestions here if needed
  return suggestions;
} 