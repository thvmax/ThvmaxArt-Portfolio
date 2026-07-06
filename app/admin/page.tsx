"use client";

// Admin panel: edits the whole-site content document (content/data.json)
// and publishes it by committing to GitHub (production) or writing the
// local file (development). See docs/superpowers/specs/2026-07-06-admin-panel-design.md.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  CaseStudy,
  Discipline,
  Experience,
  Project,
  Service,
  SiteInfo,
  SocialLink,
  Stat,
} from '@/lib/data';
import {
  Checkbox,
  Lines,
  ListEditor,
  LongText,
  MediaField,
  NumberField,
  Select,
  Text,
} from './fields';
import styles from './admin.module.css';

interface SiteContent {
  site: SiteInfo;
  disciplines: Discipline[];
  works: Project[];
  services: Service[];
  experience: Experience[];
  skills: string[];
  marquee: string[];
  stats: Stat[];
}

const SECTIONS = [
  'Site',
  'Disciplines',
  'Projects',
  'Services',
  'Experience',
  'Toolkit',
  'Marquee',
  'Stats',
] as const;
type Section = (typeof SECTIONS)[number];

const emptyCaseStudy = (): CaseStudy => ({
  tagline: '',
  overview: '',
  scope: [],
  blocks: [],
  gallery: [],
});

export default function Admin() {
  const router = useRouter();
  const [data, setData] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<Section>('Projects');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        if (!res.ok) throw new Error((await res.json()).error ?? 'Load failed');
        return res.json();
      })
      .then((d) => d && setData(d))
      .catch((e) => setError(String(e)));
  }, [router]);

  function update(patch: Partial<SiteContent>) {
    setData((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
    setStatus('');
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await res.json().catch(() => ({}));
    if (res.ok) {
      setDirty(false);
      setStatus(
        out.published === 'github'
          ? 'Published — live in about a minute once Vercel redeploys.'
          : 'Saved locally (dev mode).',
      );
    } else {
      setError(out.error ?? 'Save failed.');
    }
    setSaving(false);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (error && !data) {
    return <main className={styles.loginWrap}><p className={styles.errorText}>{error}</p></main>;
  }
  if (!data) {
    return <main className={styles.loginWrap}><p>Loading content…</p></main>;
  }

  const disciplineOptions = data.disciplines.map((d) => ({ value: d.slug, label: d.title }));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <span className={styles.sidebarLogo}>THVMAX · Admin</span>
        <nav className={styles.sidebarNav}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.sidebarLink} ${section === s ? styles.sidebarLinkActive : ''}`}
              onClick={() => setSection(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFoot}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
            View site ↗
          </a>
          <button type="button" className={styles.sidebarLink} onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.contentHead}>
          <h1>{section}</h1>
          <div className={styles.saveRow}>
            {status && <span className={styles.statusOk}>{status}</span>}
            {error && <span className={styles.errorText}>{error}</span>}
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={save}
              disabled={saving || !dirty}
            >
              {saving ? 'Publishing…' : dirty ? 'Save & publish' : 'Saved'}
            </button>
          </div>
        </header>

        {section === 'Site' && (
          <SiteEditor value={data.site} onChange={(site) => update({ site })} />
        )}

        {section === 'Disciplines' && (
          <>
            <p className={styles.sectionNote}>
              Slugs map to routes (/art-direction …). Changing a slug also requires a matching
              route folder in the code — edit titles and copy freely, slugs with care.
            </p>
            <ListEditor
              items={data.disciplines}
              onChange={(disciplines) => update({ disciplines })}
              title="discipline"
              itemLabel={(d) => d.title || d.slug || 'Untitled'}
              makeNew={() => ({ slug: '', title: '', desc: '', gradient: 'linear-gradient(90deg, #ccc, #999)', featured: '' })}
              renderItem={(d, set) => (
                <>
                  <Text label="Title" value={d.title} onChange={(title) => set({ ...d, title })} />
                  <Text label="Slug" value={d.slug} onChange={(slug) => set({ ...d, slug })} hint="Route path, e.g. art-direction" />
                  <LongText label="Description" value={d.desc} onChange={(desc) => set({ ...d, desc })} />
                  <Text label="Gradient (CSS)" value={d.gradient} onChange={(gradient) => set({ ...d, gradient })} />
                  <Select
                    label="Featured project (homepage card)"
                    value={d.featured}
                    options={data.works.map((w) => ({ value: w.name, label: w.name }))}
                    onChange={(featured) => set({ ...d, featured })}
                  />
                </>
              )}
            />
          </>
        )}

        {section === 'Projects' && (
          <ListEditor
            items={data.works}
            onChange={(works) => update({ works })}
            title="project"
            itemLabel={(w) => w.name || 'Untitled project'}
            makeNew={() => ({ name: 'New project', year: `${new Date().getFullYear()}`, cat: '', hue: 200 })}
            renderItem={(w, set) => (
              <ProjectEditor project={w} onChange={set} disciplineOptions={disciplineOptions} />
            )}
          />
        )}

        {section === 'Services' && (
          <ListEditor
            items={data.services}
            onChange={(services) => update({ services })}
            title="service"
            itemLabel={(s) => `${s.num} ${s.title}` || 'Untitled'}
            makeNew={() => ({ num: String(data.services.length + 1).padStart(2, '0'), title: '', desc: '' })}
            renderItem={(s, set) => (
              <>
                <Text label="Number" value={s.num} onChange={(num) => set({ ...s, num })} />
                <Text label="Title" value={s.title} onChange={(title) => set({ ...s, title })} />
                <LongText label="Description" value={s.desc} onChange={(desc) => set({ ...s, desc })} />
              </>
            )}
          />
        )}

        {section === 'Experience' && (
          <ListEditor
            items={data.experience}
            onChange={(experience) => update({ experience })}
            title="entry"
            itemLabel={(e) => `${e.role} — ${e.co}` || 'Untitled'}
            makeNew={() => ({ role: '', co: '', year: '' })}
            renderItem={(e, set) => (
              <>
                <Text label="Role" value={e.role} onChange={(role) => set({ ...e, role })} />
                <Text label="Company" value={e.co} onChange={(co) => set({ ...e, co })} />
                <Text label="Years" value={e.year} onChange={(year) => set({ ...e, year })} />
              </>
            )}
          />
        )}

        {section === 'Toolkit' && (
          <Lines label="Tools & skills" value={data.skills} onChange={(skills) => update({ skills })} />
        )}

        {section === 'Marquee' && (
          <Lines label="Brand names (scrolling strip)" value={data.marquee} onChange={(marquee) => update({ marquee })} />
        )}

        {section === 'Stats' && (
          <ListEditor
            items={data.stats}
            onChange={(stats) => update({ stats })}
            title="stat"
            itemLabel={(s) => `${s.value} ${s.label}` || 'Untitled'}
            makeNew={() => ({ value: '', label: '' })}
            renderItem={(s, set) => (
              <>
                <Text label="Value" value={s.value} onChange={(value) => set({ ...s, value })} hint="e.g. 7+" />
                <Text label="Label" value={s.label} onChange={(label) => set({ ...s, label })} />
              </>
            )}
          />
        )}
      </main>
    </div>
  );
}

function SiteEditor({ value, onChange }: { value: SiteInfo; onChange: (v: SiteInfo) => void }) {
  const set = (patch: Partial<SiteInfo>) => onChange({ ...value, ...patch });
  return (
    <>
      <h2 className={styles.subHead}>Hero</h2>
      <LongText label="Hero statement" value={value.heroStatement} onChange={(heroStatement) => set({ heroStatement })} />
      <MediaField label="Hero video" value={value.heroVideo} onChange={(heroVideo) => set({ heroVideo })} accept="video/mp4,video/webm" />

      <h2 className={styles.subHead}>About</h2>
      <LongText label="Bio" rows={5} value={value.aboutBio} onChange={(aboutBio) => set({ aboutBio })} />

      <h2 className={styles.subHead}>Contact</h2>
      <Text label="Email" value={value.email} onChange={(email) => set({ email })} />
      <Text label="Phone (display)" value={value.phone} onChange={(phone) => set({ phone })} />
      <Text label="Phone (tel: link)" value={value.phoneHref} onChange={(phoneHref) => set({ phoneHref })} hint="Digits only, e.g. +971565776382" />
      <Text label="Location" value={value.location} onChange={(location) => set({ location })} />

      <h2 className={styles.subHead}>Footer</h2>
      <LongText label="Contact prompt" value={value.footerPrompt} onChange={(footerPrompt) => set({ footerPrompt })} hint="Line breaks are kept." />
      <ListEditor
        items={value.social}
        onChange={(social) => set({ social })}
        title="social link"
        itemLabel={(s) => s.label || 'Untitled'}
        makeNew={(): SocialLink => ({ label: '', href: '' })}
        renderItem={(s, setItem) => (
          <>
            <Text label="Label" value={s.label} onChange={(label) => setItem({ ...s, label })} />
            <Text label="URL" value={s.href} onChange={(href) => setItem({ ...s, href })} />
          </>
        )}
      />
      <Text label="Copyright line" value={value.copyright} onChange={(copyright) => set({ copyright })} />
    </>
  );
}

function ProjectEditor({
  project,
  onChange,
  disciplineOptions,
}: {
  project: Project;
  onChange: (p: Project) => void;
  disciplineOptions: { value: string; label: string }[];
}) {
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch });
  const cs = project.caseStudy;

  return (
    <>
      <Text label="Name" value={project.name} onChange={(name) => set({ name })} />
      <div className={styles.fieldRow}>
        <Text label="Year" value={project.year} onChange={(year) => set({ year })} />
        <Text label="Category line" value={project.cat} onChange={(cat) => set({ cat })} hint="e.g. FMCG · TVC Campaign" />
        <NumberField label="Hue (placeholder color)" value={project.hue} onChange={(hue) => set({ hue })} hint="0–360; used when no image/video is set" />
      </div>

      <MediaField label="Cover image" value={project.img ?? ''} onChange={(img) => set({ img: img || undefined })} accept="image/*" />
      <MediaField label="Cover video (takes priority)" value={project.video ?? ''} onChange={(video) => set({ video: video || undefined })} accept="video/mp4,video/webm" />

      <div className={styles.field}>
        <span>Disciplines</span>
        <div className={styles.checkGroup}>
          {disciplineOptions.map((d) => (
            <Checkbox
              key={d.value}
              label={d.label}
              checked={project.disciplines?.includes(d.value) ?? false}
              onChange={(on) => {
                const current = project.disciplines ?? [];
                set({
                  disciplines: on
                    ? [...current, d.value]
                    : current.filter((s) => s !== d.value),
                });
              }}
            />
          ))}
        </div>
      </div>

      <Checkbox
        label="Hide from homepage showcase (still listed on discipline pages)"
        checked={project.hideOnHome ?? false}
        onChange={(hideOnHome) => set({ hideOnHome: hideOnHome || undefined })}
      />

      <LongText label="Short description" value={project.desc ?? ''} onChange={(desc) => set({ desc: desc || undefined })} />
      <div className={styles.fieldRow}>
        <Text label="Client" value={project.client ?? ''} onChange={(client) => set({ client: client || undefined })} />
        <Text label="Role" value={project.role ?? ''} onChange={(role) => set({ role: role || undefined })} />
      </div>
      <Text
        label="External case-study link"
        value={project.caseStudyHref ?? ''}
        onChange={(caseStudyHref) => set({ caseStudyHref: caseStudyHref || undefined })}
        hint="Optional route like /sting-night-life — shows a “View full case study” button in the overlay."
      />

      <div className={styles.caseStudyBlock}>
        <Checkbox
          label="Case study (in-overlay story with banners)"
          checked={Boolean(cs)}
          onChange={(on) => set({ caseStudy: on ? emptyCaseStudy() : undefined })}
        />
        {cs && (
          <CaseStudyEditor value={cs} onChange={(caseStudy) => set({ caseStudy })} />
        )}
      </div>
    </>
  );
}

function CaseStudyEditor({ value, onChange }: { value: CaseStudy; onChange: (v: CaseStudy) => void }) {
  const set = (patch: Partial<CaseStudy>) => onChange({ ...value, ...patch });
  return (
    <div className={styles.caseStudyInner}>
      <Text label="Tagline" value={value.tagline} onChange={(tagline) => set({ tagline })} />
      <LongText label="Overview" rows={4} value={value.overview} onChange={(overview) => set({ overview })} />
      <Lines label="Scope tags" value={value.scope} onChange={(scope) => set({ scope })} />

      <h3 className={styles.subHead}>Story blocks</h3>
      <ListEditor
        items={value.blocks}
        onChange={(blocks) => set({ blocks })}
        title="block"
        itemLabel={(b) => b.heading || 'Untitled block'}
        makeNew={() => ({ heading: '', body: '' })}
        renderItem={(b, setItem) => (
          <>
            <Text label="Heading" value={b.heading} onChange={(heading) => setItem({ ...b, heading })} />
            <LongText label="Body" rows={4} value={b.body} onChange={(body) => setItem({ ...b, body })} />
          </>
        )}
      />

      <h3 className={styles.subHead}>Gallery banners</h3>
      <ListEditor
        items={value.gallery}
        onChange={(gallery) => set({ gallery })}
        title="banner"
        itemLabel={(g, i) => g.label || `Banner ${i + 1}`}
        makeNew={() => ({ hue: 200, span: 'full' as const, ratio: 'wide' as const, label: '' })}
        renderItem={(g, setItem) => (
          <>
            <MediaField label="Image" value={g.img ?? ''} onChange={(img) => setItem({ ...g, img: img || undefined })} accept="image/*" />
            <Text label="Caption" value={g.label ?? ''} onChange={(label) => setItem({ ...g, label: label || undefined })} />
            <div className={styles.fieldRow}>
              <Select
                label="Width"
                value={g.span ?? 'half'}
                options={[
                  { value: 'full', label: 'Full width' },
                  { value: 'half', label: 'Half (paired)' },
                ]}
                onChange={(span) => setItem({ ...g, span: span as 'full' | 'half' })}
              />
              <Select
                label="Shape"
                value={g.ratio ?? 'wide'}
                options={[
                  { value: 'wide', label: 'Wide (16:9)' },
                  { value: 'tall', label: 'Tall (4:5)' },
                ]}
                onChange={(ratio) => setItem({ ...g, ratio: ratio as 'wide' | 'tall' })}
              />
              <NumberField label="Hue (no image)" value={g.hue} onChange={(hue) => setItem({ ...g, hue })} />
            </div>
          </>
        )}
      />
    </div>
  );
}
