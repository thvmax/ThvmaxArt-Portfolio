// Thin wrapper around the GitHub Contents API. The admin panel stores
// content and uploads by committing to the repo — Vercel then redeploys.
// When GITHUB_TOKEN is unset (local dev) callers fall back to the
// local filesystem instead; use isGitHubConfigured() to decide.

const API = 'https://api.github.com';

function repo(): string {
  const r = process.env.GITHUB_REPO;
  if (!r) throw new Error('GITHUB_REPO env var missing (expected "owner/name")');
  return r;
}

function branch(): string {
  return process.env.GITHUB_BRANCH || 'main';
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env var missing');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export function isGitHubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

export interface RepoFile {
  contentBase64: string;
  sha: string;
}

// Returns null when the file doesn't exist on the branch.
export async function getRepoFile(path: string): Promise<RepoFile | null> {
  const res = await fetch(
    `${API}/repos/${repo()}/contents/${path}?ref=${branch()}`,
    { headers: headers(), cache: 'no-store' },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return { contentBase64: (data.content as string).replace(/\n/g, ''), sha: data.sha };
}

export async function putRepoFile(
  path: string,
  contentBase64: string,
  message: string,
  sha?: string,
): Promise<void> {
  const res = await fetch(`${API}/repos/${repo()}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: branch(),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }
}
