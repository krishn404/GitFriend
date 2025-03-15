// GitHub API service for making authenticated requests
const GITHUB_API_URL = "https://api.github.com"

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  visibility: string
}

export interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  html_url: string
}

// Helper function to make authenticated GitHub API requests
async function fetchFromGitHub(endpoint: string) {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error("GitHub token is not configured")
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(`GitHub API error: ${error.message}`)
  }

  return response.json()
}

// Get user details
export async function getUserDetails(username: string): Promise<GitHubUser> {
  return fetchFromGitHub(`/users/${username}`)
}

// Get user repositories
export async function getUserRepositories(username: string): Promise<GitHubRepo[]> {
  return fetchFromGitHub(`/users/${username}/repos?sort=updated&per_page=10`)
}

// Get repository details
export async function getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepo> {
  return fetchFromGitHub(`/repos/${owner}/${repo}`)
}

// Get repository commits
export async function getRepositoryCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
  return fetchFromGitHub(`/repos/${owner}/${repo}/commits?per_page=10`)
}

// Search repositories
export async function searchRepositories(query: string): Promise<{ items: GitHubRepo[] }> {
  return fetchFromGitHub(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`)
}

