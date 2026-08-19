import { Injectable } from '@angular/core';

interface GitHubRepositoryResponse {
  stargazers_count?: unknown;
}

@Injectable({ providedIn: 'root' })
export class GitHubStarsService {
  readonly #counts = new Map<string, Promise<number | undefined>>();

  async count(repositoryUrl: string): Promise<number | undefined> {
    const match = repositoryUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)\/?$/);
    if (!match) return undefined;

    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}`;
    let count = this.#counts.get(apiUrl);
    if (!count) {
      count = this.#fetchCount(apiUrl);
      this.#counts.set(apiUrl, count);
    }
    return count;
  }

  async #fetchCount(apiUrl: string): Promise<number | undefined> {
    const response = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github+json' },
    }).catch(() => undefined);
    if (!response?.ok) return undefined;
    const data = (await response.json().catch(() => undefined)) as
      | GitHubRepositoryResponse
      | undefined;
    return typeof data?.stargazers_count === 'number' && Number.isInteger(data.stargazers_count)
      ? data.stargazers_count
      : undefined;
  }
}
