import Link from "next/link";
import type { Episode, InspirationSet, Track } from "@/lib/jarvis";

export const STATUSES = ["candidate", "selected", "deferred", "rejected", "played"] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#080705] text-[#f4efe4]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,82,44,.22),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,194,86,.14),transparent_26%),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,auto,34px_34px,34px_34px]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1760px] lg:grid-cols-[92px_1fr]">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/12 bg-[#080705]/90 px-4 backdrop-blur-xl lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-0 lg:py-5">
      <Link href="/" className="grid size-10 place-items-center rounded-full border border-[#f4efe4] bg-[#f4efe4] text-lg font-black text-[#080705] shadow-[0_0_35px_rgba(255,82,44,.28)]">SS</Link>
      <nav className="flex gap-2 overflow-x-auto text-[11px] font-black uppercase tracking-[0.18em] lg:grid lg:gap-3 lg:[writing-mode:vertical-rl]">
        <Link href="/episodes" className="nav">episodes</Link>
        <Link href="/inspo" className="nav">inspo</Link>
        <Link href="/tracks" className="nav">tracks</Link>
      </nav>
      <p className="hidden rotate-180 text-[10px] font-black uppercase tracking-[0.25em] text-white/42 [writing-mode:vertical-rl] lg:block">jarvis / crate craft</p>
    </aside>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return <section className="px-3 py-3 sm:px-5 lg:px-7 lg:py-5">{children}</section>;
}

export function Panel({ children, red = false, className = "" }: { children: React.ReactNode; red?: boolean; className?: string }) {
  return <section className={`${red ? "panel-red" : "panel"} ${className}`}>{children}</section>;
}

export function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={dark ? "label text-black/55" : "label"}>{children}</p>;
}

export function Title({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <h1 className={dark ? "title text-black" : "title"}>{children}</h1>;
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${className}`} />;
}

export function Empty({ text, dark = false }: { text: string; dark?: boolean }) {
  return <div className={dark ? "border border-dashed border-black/20 bg-black/[.06] p-4 text-sm leading-6 text-black/55" : "border border-dashed border-white/18 bg-white/[.035] p-4 text-sm leading-6 text-white/50"}>{text}</div>;
}

export function Stat({ value, label, dark }: { value: number | string; label: string; dark?: boolean }) {
  return <div className={dark ? "border border-black/16 bg-black/8 p-3" : "border border-white/14 bg-white/[.04] p-3"}><p className="font-mono text-3xl font-black leading-none">{value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] opacity-60">{label}</p></div>;
}

export function episodeLabel(episode?: Episode | null) {
  if (!episode) return "No episode yet";
  return episode.episode_number ? `Episode ${episode.episode_number}` : `Episode · ${new Date(episode.created_at).toLocaleDateString()}`;
}

export function countCandidates(episode?: Episode, status?: string) {
  const candidates = episode?.jarvis_episode_candidates ?? [];
  return status ? candidates.filter((candidate) => candidate.status === status).length : candidates.length;
}

export function attachedInspo(episode?: Episode) {
  return episode?.jarvis_episode_inspiration_sets?.map((row) => row.jarvis_inspiration_sets).filter(Boolean) as InspirationSet[] | undefined;
}

export function bucketLabel(bucket: string) {
  return bucket.replace("_", " ");
}

export function SectionHeader({ kicker, title, body, dark = false }: { kicker: string; title: string; body?: string; dark?: boolean }) {
  return <div><Label dark={dark}>{kicker}</Label><h2 className={dark ? "mt-2 font-serif text-4xl leading-[.9] tracking-[-.055em] text-black sm:text-5xl" : "mt-2 font-serif text-4xl leading-[.9] tracking-[-.055em] sm:text-5xl"}>{title}</h2>{body && <p className={dark ? "mt-3 max-w-xl text-sm font-bold leading-6 text-black/58" : "mt-3 max-w-xl text-sm leading-6 text-white/55"}>{body}</p>}</div>;
}

export function MixCard({ set, compact }: { set: InspirationSet; compact?: boolean }) {
  return <a href={set.url} target="_blank" rel="noreferrer" className="group block border border-white/14 bg-[#11100d] p-4 hover:border-[#ff4f2e] hover:bg-[#17130f]"><p className="label text-[#ff6846]">{set.source_type}</p><h3 className={compact ? "mt-2 font-serif text-2xl leading-none tracking-[-.035em]" : "mt-3 font-serif text-4xl leading-none tracking-[-.045em]"}>{set.title}</h3><p className="mt-2 text-sm text-white/50">{set.artist_or_channel}</p>{!compact && <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">{set.flow_notes || set.notes || "no notes yet"}</p>}</a>;
}

export function EpisodeCard({ episode, active }: { episode: Episode; active?: boolean }) {
  return <article className={active ? "border-2 border-[#ff4f2e] bg-[#ff4f2e] p-4 text-black shadow-[0_18px_70px_rgba(255,79,46,.22)]" : "border border-white/14 bg-white/[.04] p-4 hover:border-[#ff4f2e]"}><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-3xl leading-none tracking-[-.045em]">{episodeLabel(episode)}</h3><span className="font-mono text-xs font-black uppercase">{episode.status.replace("_", " ")}</span></div>{episode.title && !episode.title.startsWith("Episode ") && <p className="mt-2 text-sm font-bold opacity-70">{episode.title}</p>}<p className="mt-3 text-sm font-bold opacity-70">{countCandidates(episode)} candidates · {countCandidates(episode, "selected")} selected · {attachedInspo(episode)?.length ?? 0} mixes</p></article>;
}

export function TrackCard({ track }: { track: Track }) {
  const tags = track.jarvis_track_tags ?? [];
  const links = track.jarvis_track_links ?? [];
  const drops = track.jarvis_picodrops_files ?? [];
  return <article className="border border-white/14 bg-[#11100d] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.18em] text-white/45">{track.artist}</p><h3 className="mt-2 font-serif text-3xl leading-none tracking-[-.04em]">{track.title}</h3></div><span className="border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-[.14em] text-[#ff6846]">{bucketLabel(track.rating_bucket)}</span></div>{track.notes && <p className="mt-3 text-sm leading-6 text-white/58">{track.notes}</p>}<div className="mt-4 flex flex-wrap gap-2">{tags.map(({ tag }) => <span key={tag} className="bg-[#f4efe4] px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">{tag}</span>)}{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="bg-[#ff4f2e] px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">{link.type}</a>)}{!!drops.length && <span className="bg-[#ffd24a] px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">PicoDrops</span>}</div></article>;
}
