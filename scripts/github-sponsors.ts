export interface PublicSponsor {
  login: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
}

export interface PublicSponsors {
  current: PublicSponsor[];
  past: PublicSponsor[];
}

interface SponsorWithTier extends PublicSponsor {
  monthlyPriceInDollars: number;
}

interface SponsorshipNode {
  sponsorEntity?: {
    login?: unknown;
    name?: unknown;
    avatarUrl?: unknown;
    url?: unknown;
  } | null;
  tier?: { monthlyPriceInDollars?: unknown } | null;
}

interface SponsorsResponse {
  data?: {
    user?: {
      sponsorshipsAsMaintainer?: {
        nodes?: SponsorshipNode[];
        pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
      };
    } | null;
  };
  errors?: { message?: string }[];
}

const query = `
  query PublicSponsors($login: String!, $cursor: String, $activeOnly: Boolean!) {
    user(login: $login) {
      sponsorshipsAsMaintainer(
        first: 100
        after: $cursor
        activeOnly: $activeOnly
        includePrivate: false
      ) {
        nodes {
          sponsorEntity {
            ... on User { login name avatarUrl url }
            ... on Organization { login name avatarUrl url }
          }
          tier { monthlyPriceInDollars }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

function isExpectedUrl(value: unknown, hostname: string): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === hostname;
  } catch {
    return false;
  }
}

function parseSponsor(node: SponsorshipNode): SponsorWithTier | undefined {
  const entity = node.sponsorEntity;
  const monthlyPrice = node.tier?.monthlyPriceInDollars;
  if (
    typeof entity?.login !== 'string' ||
    entity.login.length === 0 ||
    !isExpectedUrl(entity.avatarUrl, 'avatars.githubusercontent.com') ||
    !isExpectedUrl(entity.url, 'github.com') ||
    (monthlyPrice !== null &&
      monthlyPrice !== undefined &&
      (typeof monthlyPrice !== 'number' || !Number.isFinite(monthlyPrice)))
  ) {
    return undefined;
  }
  return {
    login: entity.login,
    name:
      typeof entity.name === 'string' && entity.name.trim().length > 0
        ? entity.name.trim()
        : entity.login,
    avatarUrl: entity.avatarUrl,
    profileUrl: entity.url,
    monthlyPriceInDollars: typeof monthlyPrice === 'number' ? monthlyPrice : 0,
  };
}

async function fetchSponsorships(
  login: string,
  token: string,
  activeOnly: boolean,
  fetchImplementation: typeof fetch = fetch,
): Promise<Map<string, SponsorWithTier>> {
  const sponsors = new Map<string, SponsorWithTier>();
  let cursor: string | null = null;
  do {
    const response = await fetchImplementation('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'rdlabo-docs-sponsor-generator',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ query, variables: { login, cursor, activeOnly } }),
    });
    if (!response.ok) {
      throw new Error(`GitHub Sponsors request failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as SponsorsResponse;
    if (payload.errors?.length) {
      throw new Error(
        `GitHub Sponsors request failed: ${payload.errors.map(({ message }) => message).join('; ')}`,
      );
    }
    const connection = payload.data?.user?.sponsorshipsAsMaintainer;
    if (!connection) throw new Error(`GitHub user ${login} was not found`);

    for (const node of connection.nodes ?? []) {
      const sponsor = parseSponsor(node);
      if (sponsor) {
        const key = sponsor.login.toLowerCase();
        const previous = sponsors.get(key);
        if (!previous || sponsor.monthlyPriceInDollars > previous.monthlyPriceInDollars) {
          sponsors.set(key, sponsor);
        }
      }
    }
    cursor = connection.pageInfo?.hasNextPage ? (connection.pageInfo.endCursor ?? null) : null;
    if (connection.pageInfo?.hasNextPage && !cursor) {
      throw new Error('GitHub Sponsors pagination did not return an end cursor');
    }
  } while (cursor);

  return sponsors;
}

function sortedSponsors(sponsors: SponsorWithTier[]): PublicSponsor[] {
  return sponsors
    .sort((left, right) => {
      const tierOrder = right.monthlyPriceInDollars - left.monthlyPriceInDollars;
      if (tierOrder !== 0) return tierOrder;
      const leftLogin = left.login.toLowerCase();
      const rightLogin = right.login.toLowerCase();
      return leftLogin === rightLogin ? 0 : leftLogin < rightLogin ? -1 : 1;
    })
    .map(({ monthlyPriceInDollars: _, ...sponsor }) => sponsor);
}

export async function fetchPublicSponsors(
  login: string,
  token: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<PublicSponsors> {
  if (!token) throw new Error('GITHUB_TOKEN is required to update sponsors');

  const [currentByLogin, allByLogin] = await Promise.all([
    fetchSponsorships(login, token, true, fetchImplementation),
    fetchSponsorships(login, token, false, fetchImplementation),
  ]);
  return {
    current: sortedSponsors([...currentByLogin.values()]),
    past: sortedSponsors(
      [...allByLogin.entries()]
        .filter(([loginKey]) => !currentByLogin.has(loginKey))
        .map(([, sponsor]) => sponsor),
    ),
  };
}

export function sponsorsModule(sponsors: PublicSponsors): string {
  return `// Generated by scripts/generate-sponsors.ts. Do not edit.\nexport const CURRENT_SPONSORS = ${JSON.stringify(sponsors.current, null, 2)} as const;\n\nexport const PAST_SPONSORS = ${JSON.stringify(sponsors.past, null, 2)} as const;\n`;
}
