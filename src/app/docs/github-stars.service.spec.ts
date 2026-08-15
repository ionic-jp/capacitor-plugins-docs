import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GitHubStarsService } from './github-stars.service';

describe('GitHubStarsService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads the public GitHub stargazer count without credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 42 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const service = TestBed.inject(GitHubStarsService);
    await expect(service.count('https://github.com/rdlabo-dev/docs')).resolves.toBe(42);
    await expect(service.count('https://github.com/rdlabo-dev/docs')).resolves.toBe(42);
    expect(fetchMock).toHaveBeenCalledWith('https://api.github.com/repos/rdlabo-dev/docs', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fails closed for unsupported URLs and unavailable counts', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const service = TestBed.inject(GitHubStarsService);

    await expect(service.count('https://example.com/repository')).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();

    fetchMock.mockResolvedValue({ ok: false });
    await expect(service.count('https://github.com/rdlabo-dev/docs')).resolves.toBeUndefined();
  });
});
