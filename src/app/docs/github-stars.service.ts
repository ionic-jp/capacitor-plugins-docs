import { Injectable } from '@angular/core';

interface GitHubRepositoryResponse {
  stargazers_count?: unknown;
}

@Injectable({ providedIn: 'root' })
export class GitHubStarsService {
  private readonly counts = new Map<string, Promise<number | undefined>>();

  async count(repositoryUrl: string): Promise<number | undefined> {
    const match = repositoryUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)\/?$/);
    if (!match) return undefined;

    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}`;
    let count = this.counts.get(apiUrl);
    if (!count) {
      count = this.fetchCount(apiUrl);
      this.counts.set(apiUrl, count);
    }
    return count;
  }

  private async fetchCount(apiUrl: string): Promise<number | undefined> {
    try {
      const response = await fetch(apiUrl, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) return undefined;
      const data = (await response.json()) as GitHubRepositoryResponse;
      return typeof data.stargazers_count === 'number' && Number.isInteger(data.stargazers_count)
        ? data.stargazers_count
        : undefined;
    } catch {
      return undefined;
    }
  }
}
