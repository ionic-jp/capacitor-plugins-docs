import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchPublicSponsors, sponsorsModule } from './github-sponsors';

function githubResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('fetches only valid public sponsors and sorts by tier without publishing amounts', async () => {
  const requests: { activeOnly: boolean; cursor: string | null }[] = [];
  const smallSponsor = {
    sponsorEntity: {
      login: 'small',
      name: null,
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      url: 'https://github.com/small',
    },
    tier: { monthlyPriceInDollars: 5 },
  };
  const largeSponsor = {
    sponsorEntity: {
      login: 'large',
      name: 'Large Sponsor',
      avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      url: 'https://github.com/large',
    },
    tier: { monthlyPriceInDollars: 100 },
  };
  const pastSponsor = {
    sponsorEntity: {
      login: 'one-time',
      name: 'One-time Sponsor',
      avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
      url: 'https://github.com/one-time',
    },
    tier: null,
  };
  const fetchImplementation: typeof fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      variables: { activeOnly: boolean; cursor: string | null };
    };
    const { activeOnly, cursor } = body.variables;
    requests.push({ activeOnly, cursor });
    const nodes = activeOnly
      ? cursor
        ? [largeSponsor]
        : [
            smallSponsor,
            {
              sponsorEntity: {
                login: 'unsafe',
                name: 'Unsafe image',
                avatarUrl: 'https://example.com/avatar.png',
                url: 'https://github.com/unsafe',
              },
              tier: { monthlyPriceInDollars: 10_000 },
            },
          ]
      : [smallSponsor, largeSponsor, largeSponsor, pastSponsor];
    return githubResponse({
      data: {
        user: {
          sponsorshipsAsMaintainer: {
            nodes,
            pageInfo: {
              hasNextPage: activeOnly && cursor === null,
              endCursor: activeOnly && cursor === null ? 'next' : null,
            },
          },
        },
      },
    });
  };

  const sponsors = await fetchPublicSponsors('rdlabo', 'test-token', fetchImplementation);

  assert.deepEqual(requests, [
    { activeOnly: true, cursor: null },
    { activeOnly: false, cursor: null },
    { activeOnly: true, cursor: 'next' },
  ]);
  assert.deepEqual(sponsors, {
    current: [
      {
        login: 'large',
        name: 'Large Sponsor',
        avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
        profileUrl: 'https://github.com/large',
      },
      {
        login: 'small',
        name: 'small',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        profileUrl: 'https://github.com/small',
      },
    ],
    past: [
      {
        login: 'one-time',
        name: 'One-time Sponsor',
        avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
        profileUrl: 'https://github.com/one-time',
      },
    ],
  });
  assert.doesNotMatch(sponsorsModule(sponsors), /monthlyPriceInDollars/);
});

test('fails closed when GitHub rejects the request', async () => {
  const fetchImplementation: typeof fetch = async () => new Response('', { status: 401 });
  await assert.rejects(
    () => fetchPublicSponsors('rdlabo', 'bad-token', fetchImplementation),
    /HTTP 401/,
  );
});
