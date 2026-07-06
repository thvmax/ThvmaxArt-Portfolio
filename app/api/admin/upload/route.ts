import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { putRepoFile, getRepoFile, isGitHubConfigured } from '@/lib/github';

// Uploads are committed to public/uploads/ and referenced by path.
// GitHub's Contents API handles files well below ~10 MB; anything bigger
// (long videos) should live on a CDN and be referenced by URL instead.
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'mp4', 'webm']);

function sanitizeName(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return base || 'file';
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file in request.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: `File type ".${ext}" not allowed. Use: ${[...ALLOWED].join(', ')}.` },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File is over 10 MB. Host large videos externally and paste the URL instead.' },
      { status: 400 },
    );
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const repoPath = `public/uploads/${stamp}-${sanitizeName(file.name)}`;
  const publicPath = repoPath.replace(/^public/, '');
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (isGitHubConfigured()) {
      const existing = await getRepoFile(repoPath);
      await putRepoFile(
        repoPath,
        buffer.toString('base64'),
        `Upload ${publicPath} via admin panel`,
        existing?.sha,
      );
      return NextResponse.json({ ok: true, path: publicPath, published: 'github' });
    }
    const localPath = path.join(process.cwd(), repoPath);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);
    return NextResponse.json({ ok: true, path: publicPath, published: 'local' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
