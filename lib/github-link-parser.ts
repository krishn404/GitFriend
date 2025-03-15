export interface ParsedGitHubLink {
  type: "profile" | "repository"
  owner: string
  repo?: string
  url: string
}

export function parseGitHubLink(text: string): ParsedGitHubLink | null {
  // Regular expression to match GitHub URLs
  const githubUrlRegex = /https?:\/\/(?:www\.)?github\.com\/([^/\s]+)(?:\/([^/\s]+))?/g

  let match
  while ((match = githubUrlRegex.exec(text)) !== null) {
    const [url, owner, repo] = match

    if (owner && repo) {
      return {
        type: "repository",
        owner,
        repo,
        url,
      }
    } else if (owner) {
      return {
        type: "profile",
        owner,
        url,
      }
    }
  }

  return null
}

