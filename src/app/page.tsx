import { addCandidate, addEpisode, addInspirationSet, addTrack, attachInspirationToEpisode } from "./actions";
import { getJarvisData, type Episode, type InspirationSet, type Track } from "@/lib/jarvis";

export const dynamic = "force-dynamic";

type Data = Awaited<ReturnType<typeof getJarvisData>>;

async function loadData(): Promise<Data | null> {
  try {
    return await getJarvisData();
  } catch (error) {
    console.error(error);
    return null;
  }
}

const demoTrack: Track = {
  id: "fallback-1",
  artist: "start here",
  title: "drop a track, then attach it to the active episode",
  display_title: null,
  rating_bucket: "unrated",
  notes: "Jarvis is empty until you feed the crate. Add YouTube, SoundCloud, Spotify, or a PicoDrops local path.",
  created_at: new Date().toISOString(),
  jarvis_track_tags: [{ tag: "empty crate" }],
  jarvis_track_links: [],
  jarvis_picodrops_files: [],
};

function bucketLabel(bucket: string) {
  return bucket.replace("_", " ");
}

function countCandidates(episode?: Episode, status?: string) {
  const candidates = episode?.jarvis_episode_candidates ?? [];
  return status ? candidates.filter((candidate) => candidate.status === status).length : candidates.length;
}

function attachedInspo(episode?: Episode) {
  return episode?.jarvis_episode_inspiration_sets?.map((row) => row.jarvis_inspiration_sets).filter(Boolean) as InspirationSet[] | undefined;
}

export default async function Home() {
  const data = await loadData();
  const tracks = data?.tracks.length ? data.tracks : [demoTrack];
  const realTracks = tracks.filter((track) => !track.id.startsWith("fallback"));
  const inspirationSets = data?.inspirationSets ?? [];
  const episodes = data?.episodes ?? [];
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];
  const episodeInspo = attachedInspo(activeEpisode) ?? [];
  const downloaded = realTracks.filter((track) => (track.jarvis_picodrops_files?.length ?? 0) > 0).length;

  return (
    <main className="min-h-screen bg-[#050505] text-[#f4f0e8]">
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,56,38,.18),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(255,199,86,.11),transparent_26%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[88px_1fr]">
        <aside className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/15 bg-[#050505]/92 px-4 backdrop-blur-xl lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-0 lg:py-5">
          <a href="#now" className="grid size-10 place-items-center border border-white bg-[#f4f0e8] text-xl font-black text-black">SS</a>
          <nav className="flex gap-2 overflow-x-auto text-[11px] font-black uppercase tracking-[0.18em] lg:grid lg:gap-3 lg:[writing-mode:vertical-rl]">
            {[
              ["now", "now"],
              ["inspo-pile", "inspo"],
              ["tracks", "tracks"],
              ["episodes", "episodes"],
            ].map(([href, label]) => (
              <a key={href} href={`#${href}`} className="border border-white/15 px-3 py-2 hover:border-[#ff3826] hover:bg-[#ff3826] hover:text-black lg:px-2 lg:py-3">{label}</a>
            ))}
          </nav>
          <p className="hidden rotate-180 text-[10px] font-black uppercase tracking-[0.25em] text-white/45 [writing-mode:vertical-rl] lg:block">jarvis / azorean-base</p>
        </aside>

        <section className="px-3 py-3 sm:px-5 lg:px-7 lg:py-5">
          <header id="now" className="grid gap-3 lg:grid-cols-[1.25fr_.75fr]">
            <section className="panel-red min-h-[360px] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/70">
                <span className="bg-black px-2 py-1 text-[#ff3826]">now planning</span>
                <span>{activeEpisode?.status.replace("_", " ") ?? "no episode yet"}</span>
              </div>
              <div className="mt-10">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-black/55">episode</p>
                <h1 className="mt-2 max-w-5xl font-serif text-[4rem] font-black leading-[0.82] tracking-[-0.08em] text-black sm:text-[6rem] lg:text-[8rem]">
                  {activeEpisode ? `${activeEpisode.episode_number ? `${activeEpisode.episode_number}. ` : ""}${activeEpisode.title}` : "Create the first episode"}
                </h1>
              </div>
              <div className="mt-8 grid gap-2 sm:grid-cols-4">
                <Stat dark value={countCandidates(activeEpisode)} label="candidates" />
                <Stat dark value={countCandidates(activeEpisode, "selected")} label="selected" />
                <Stat dark value={episodeInspo.length} label="mix refs" />
                <Stat dark value={downloaded} label="drops" />
              </div>
            </section>

            <section className="panel p-4 sm:p-6">
              <h2 className="label">create new episode</h2>
              <form action={addEpisode} className="mt-4 grid gap-2">
                <Input name="episode_number" placeholder="episode #" />
                <Input name="title" placeholder="title / working name" required />
                <div className="grid grid-cols-2 gap-2">
                  <Input name="planning_start" type="date" />
                  <Input name="planning_end" type="date" />
                </div>
                <select name="status" className="field"><option value="planning">planning</option><option value="crate_built">crate built</option><option value="recorded">recorded</option><option value="published">published</option></select>
                <textarea name="notes" placeholder="episode direction / constraint" className="field min-h-24" />
                <button className="button">make active workspace</button>
              </form>
            </section>
          </header>

          <div className="mt-3 grid gap-3 xl:grid-cols-[.95fr_1.05fr]">
            <section id="inspo-pile" className="panel p-4 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div><p className="label">inspo pile</p><h2 className="title">YouTube / SoundCloud mixes that point the set.</h2></div>
                <span className="counter">{inspirationSets.length}</span>
              </div>

              <form action={addInspirationSet} className="mt-5 grid gap-2 sm:grid-cols-2">
                <Input name="title" placeholder="mix title" required />
                <Input name="artist_or_channel" placeholder="DJ / channel" />
                <Input name="url" placeholder="youtube / soundcloud / mixcloud url" required className="sm:col-span-2" />
                <textarea name="flow_notes" placeholder="why it matters: arc, pace, texture" className="field min-h-20 sm:col-span-2" />
                <button className="button sm:col-span-2">add to inspo pile</button>
              </form>

              <div className="mt-5 grid gap-2">
                {inspirationSets.map((set) => <MixCard key={set.id} set={set} />)}
                {!inspirationSets.length && <Empty text="No inspo yet. Paste the first YouTube or SoundCloud set above." />}
              </div>
            </section>

            <section className="panel p-4 sm:p-6">
              <p className="label">attach mix to current episode</p>
              <h2 className="title">Make the references visible while building.</h2>
              <form action={attachInspirationToEpisode} className="mt-5 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episode.episode_number ? `${episode.episode_number}. ` : ""}{episode.title}</option>)}</select>
                <select name="inspiration_set_id" className="field" required><option value="">mix from inspo pile</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select>
                <button className="button">attach</button>
                <Input name="notes" placeholder="relationship to episode / what to steal" className="sm:col-span-3" />
              </form>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {episodeInspo.map((set) => <MixCard key={set.id} set={set} compact />)}
                {!episodeInspo.length && <Empty text="No mixes attached to the active episode yet." />}
              </div>
            </section>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[.85fr_1.15fr]">
            <section id="tracks" className="panel p-4 sm:p-6">
              <p className="label">track / drop intake</p>
              <h2 className="title">Feed the crate. link source, tag role, pair PicoDrops.</h2>
              <form action={addTrack} className="mt-5 grid gap-2 sm:grid-cols-2">
                <Input name="artist" placeholder="artist" required />
                <Input name="title" placeholder="title" required />
                <Input name="source_url" placeholder="source url" className="sm:col-span-2" />
                <Input name="local_path" placeholder="PicoDrops path" className="sm:col-span-2" />
                <select name="rating_bucket" className="field"><option value="unrated">unrated</option><option value="must_play">must play</option><option value="maybe">maybe</option><option value="archive">archive</option></select>
                <Input name="tags" placeholder="opener, warmup, bridge, reset" />
                <textarea name="notes" placeholder="why it belongs" className="field min-h-20 sm:col-span-2" />
                <button className="button sm:col-span-2">add to library</button>
              </form>
            </section>

            <section className="panel p-4 sm:p-6">
              <p className="label">candidate board</p>
              <h2 className="title">Send tracks into the episode playlist.</h2>
              <form action={addCandidate} className="mt-5 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episode.episode_number ? `${episode.episode_number}. ` : ""}{episode.title}</option>)}</select>
                <select name="track_id" className="field" required><option value="">track</option>{realTracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select>
                <select name="status" className="field"><option value="candidate">candidate</option><option value="selected">selected</option><option value="deferred">deferred</option><option value="rejected">rejected</option><option value="played">played</option></select>
                <Input name="notes" placeholder="position / reason" className="sm:col-span-3" />
                <button className="button sm:col-span-3">add to episode</button>
              </form>
            </section>
          </div>

          <section id="episodes" className="mt-3 grid gap-3 xl:grid-cols-[.8fr_1.2fr]">
            <div className="panel p-4 sm:p-6"><p className="label">episode stack</p><div className="mt-4 grid gap-2">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} active={episode.id === activeEpisode?.id} />)}{!episodes.length && <Empty text="Create an episode first. Everything else hangs off that." />}</div></div>
            <div className="panel p-4 sm:p-6"><div className="flex items-end justify-between"><div><p className="label">library</p><h2 className="title">Recent tracks and PicoDrops pairings.</h2></div><span className="counter">{realTracks.length}</span></div><div className="mt-4 grid gap-2 md:grid-cols-2">{tracks.map((track) => <TrackCard key={track.id} track={track} />)}</div></div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Stat({ value, label, dark }: { value: number | string; label: string; dark?: boolean }) {
  return <div className={dark ? "border border-black/20 bg-black/10 p-3" : "border border-white/15 bg-white/[.04] p-3"}><p className="font-mono text-3xl font-black">{value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] opacity-60">{label}</p></div>;
}
function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`field ${className}`} />; }
function Empty({ text }: { text: string }) { return <div className="border border-dashed border-white/20 bg-white/[.03] p-4 text-sm leading-6 text-white/50">{text}</div>; }
function MixCard({ set, compact }: { set: InspirationSet; compact?: boolean }) { return <a href={set.url} target="_blank" rel="noreferrer" className="block border border-white/15 bg-[#101010] p-4 hover:border-[#ff3826]"><p className="label text-[#ff3826]">{set.source_type}</p><h3 className={compact ? "mt-2 font-serif text-2xl leading-none" : "mt-3 font-serif text-4xl leading-none tracking-[-.04em]"}>{set.title}</h3><p className="mt-2 text-sm text-white/50">{set.artist_or_channel}</p>{!compact && <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">{set.flow_notes || set.notes || "no notes yet"}</p>}</a>; }
function EpisodeCard({ episode, active }: { episode: Episode; active?: boolean }) { return <article className={active ? "border-2 border-[#ff3826] bg-[#ff3826] p-4 text-black" : "border border-white/15 bg-white/[.04] p-4"}><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-3xl leading-none tracking-[-.04em]">{episode.episode_number ? `${episode.episode_number}. ` : ""}{episode.title}</h3><span className="font-mono text-xs font-black uppercase">{episode.status.replace("_", " ")}</span></div><p className="mt-3 text-sm font-bold opacity-70">{countCandidates(episode)} candidates · {countCandidates(episode, "selected")} selected · {attachedInspo(episode)?.length ?? 0} mixes</p></article>; }
function TrackCard({ track }: { track: Track }) { const tags = track.jarvis_track_tags ?? []; const links = track.jarvis_track_links ?? []; const drops = track.jarvis_picodrops_files ?? []; return <article className="border border-white/15 bg-[#101010] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.18em] text-white/45">{track.artist}</p><h3 className="mt-2 font-serif text-3xl leading-none tracking-[-.04em]">{track.title}</h3></div><span className="border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-[.14em] text-[#ff3826]">{bucketLabel(track.rating_bucket)}</span></div>{track.notes && <p className="mt-3 text-sm leading-6 text-white/58">{track.notes}</p>}<div className="mt-4 flex flex-wrap gap-2">{tags.map(({ tag }) => <span key={tag} className="bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">{tag}</span>)}{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="bg-[#ff3826] px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">{link.type}</a>)}{!!drops.length && <span className="bg-[#ffd24a] px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-black">PicoDrops</span>}</div></article>; }
