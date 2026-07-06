import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getRepoFile, putRepoFile, isGitHubConfigured } from '@/lib/github';

// Always serve fresh content (and allow PUT) — never statically optimize.
export const dynamic = 'force-dynamic';

const CONTENT_PATH = 'content/data.json';

function localPath(): string {
  return path.join(process.cwd(), CONTENT_PATH);
}

// The whole-site content document must at least carry these top-level
// sections with the right container types before we commit it.
function validate(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return 'Content must be an object.';
  const d = data as Record<string, unknown>;
  if (typeof d.site !== 'object' || d.site === null) return 'Missing "site" section.';
  for (const key of ['disciplines', 'works', 'services', 'experience', 'skills', 'marquee', 'stats']) {
    if (!Array.isArray(d[key])) return `Missing or invalid "${key}" section.`;
  }
  const site = d.site as Record<string, unknown>;
  if (typeof site.email !== 'string' || !site.email) return 'Site email is required.';
  return null;
}

export async function GET() {
  try {
    if (isGitHubConfigured()) {
      const file = await getRepoFile(CONTENT_PATH);
      if (!file) return NextResponse.json({ error: 'Content file not found in repo.' }, { status: 404 });
      return NextResponse.json(JSON.parse(Buffer.from(file.contentBase64, 'base64').toString('utf8')));
    }
    const raw = await fs.readFile(localPath(), 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const problem = validate(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const serialized = JSON.stringify(data, null, 2) + '\n';
  try {
    if (isGitHubConfigured()) {
      const existing = await getRepoFile(CONTENT_PATH);
      await putRepoFile(
        CONTENT_PATH,
        Buffer.from(serialized, 'utf8').toString('base64'),
        'Update site content via admin panel',
        existing?.sha,
      );
      return NextResponse.json({ ok: true, published: 'github' });
    }
    await fs.writeFile(localPath(), serialized, 'utf8');
    return NextResponse.json({ ok: true, published: 'local' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
