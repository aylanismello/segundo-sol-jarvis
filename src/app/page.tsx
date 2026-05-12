import { addCandidate, addEpisode, addInspirationSet, addTrack } from "./actions";
import { getJarvisData, type Episode, type Track } from "@/lib/jarvis";

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

const fallbackTracks: Track[] = [
  {
    id: "fallback-1",
    artist: "No database data yet",
    title: "Add the first track from Spotify, YouTube, SoundCloud, or PicoDrops",
    display_title: null,
    rating_bucket: "unrated",
    notes: "This is the working cockpit now — once env vars are live, records come from azorean-base.",
    created_at: new Date().toISOString(),
    jarvis_track_tags: [{ tag: "capture" }],
    jarvis_track_links: [],
    jarvis_picodrops_files: [],
  },
];

function bucketLabel(bucket: string) {
  return bucket.replace("_", " ");
}

function countCandidates(episode: Episode, status?: string) {
  const candidates = episode.jarvis_episode_candidates ?? [];
  return status ? candidates.filter((candidate) => candidate.status === status).length : candidates.length;
}

export default async function Home() {
  const data = await loadData();
  const tracks = data?.tracks.length ? data.tracks : fallbackTracks;
  const inspirationSets = data?.inspirationSets ?? [];
  const episodes = data?.episodes ?? [];
  const downloaded = tracks.filter((track) => (track.jarvis_picodrops_files?.length ?? 0) > 0).length;
  const mustPlay = tracks.filter((track) => track.rating_bucket === "must_play").length;
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];

  return (
    <main className="min-h-screen bg-[#120d09] text-[#fff4df]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,156,67,.28),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(14,126,112,.18),transparent_28%),linear-gradient(135deg,#120d09,#24120b_52%,#3a160d)]" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-black/25 p-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#ff9f43] text-[#190b05] shadow-[0_0_42px_rgba(255,159,67,.4)]">☀︎</div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#f4c888]/55">Segundo Sol</p>
              <h1 className="font-serif text-2xl">Jarvis</h1>
            </div>
          </div>

          <nav className="mt-10 grid gap-2 text-sm text-[#f8d8a8]/70">
            {["Cockpit", "Track intake", "PicoDrops", "Inspiration diary", "Episodes", "Candidate board"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl px-4 py-3 hover:bg-white/10 hover:text-[#ffd08a]">
                {item}
              </a>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-[#ffbd70]/20 bg-[#ffbd70]/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#ffcf91]/60">database</p>
            <p className="mt-2 text-sm leading-6 text-[#f8d8a8]/70">azorean-base · jarvis_* tables · server actions writing directly to Supabase.</p>
          </div>
        </aside>

        <section className="p-4 sm:p-6 xl:p-8">
          <header id="cockpit" className="rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#ffbd70]/60">working cockpit</p>
                <h2 className="mt-3 max-w-4xl font-serif text-5xl leading-none tracking-[-0.04em] sm:text-6xl">Plan the next crate from real tracks, real sets, real database state.</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
                <Stat value={tracks.length} label="tracks" />
                <Stat value={mustPlay} label="must play" />
                <Stat value={downloaded} label="PicoDrops" />
                <Stat value={episodes.length} label="episodes" />
              </div>
            </div>
          </header>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <section id="track-intake" className="rounded-[2rem] border border-white/10 bg-[#1b100b]/78 p-5 backdrop-blur-xl">
              <SectionTitle eyebrow="track intake" title="Add a discovery without leaving selector brain." />
              <form action={addTrack} className="mt-5 grid gap-3 md:grid-cols-2">
                <Input name="artist" placeholder="Artist" required />
                <Input name="title" placeholder="Title" required />
                <Input name="source_url" placeholder="Spotify / YouTube / SoundCloud URL" className="md:col-span-2" />
                <Input name="local_path" placeholder="PicoDrops local path, if downloaded" className="md:col-span-2" />
                <select name="rating_bucket" className="field">
                  <option value="unrated">unrated</option>
                  <option value="must_play">must play</option>
                  <option value="maybe">maybe</option>
                  <option value="archive">archive</option>
                </select>
                <Input name="tags" placeholder="tags: opener, bridge, reset" />
                <textarea name="notes" placeholder="notes / why it matters" className="field min-h-24 md:col-span-2" />
                <button className="button md:col-span-2">Add track</button>
              </form>
            </section>

            <section id="inspiration-diary" className="rounded-[2rem] border border-white/10 bg-[#1b100b]/78 p-5 backdrop-blur-xl">
              <SectionTitle eyebrow="inspiration diary" title="Latest YouTube / SoundCloud sets feeding the direction." />
              <form action={addInspirationSet} className="mt-5 grid gap-3">
                <Input name="title" placeholder="Set / mix title" required />
                <Input name="artist_or_channel" placeholder="DJ / channel" />
                <Input name="url" placeholder="YouTube / SoundCloud / Mixcloud URL" required />
                <textarea name="flow_notes" placeholder="flow notes: arc, texture, transitions" className="field min-h-20" />
                <textarea name="notes" placeholder="specific track sparks / why it inspires" className="field min-h-20" />
                <button className="button">Save inspiration</button>
              </form>
            </section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
            <section id="episodes" className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <SectionTitle eyebrow="episodes" title="Create planning windows and playlists." />
              <form action={addEpisode} className="mt-5 grid gap-3 sm:grid-cols-2">
                <Input name="episode_number" placeholder="Episode #" />
                <Input name="title" placeholder="Episode title" required />
                <Input name="planning_start" type="date" />
                <Input name="planning_end" type="date" />
                <select name="status" className="field sm:col-span-2">
                  <option value="planning">planning</option>
                  <option value="crate_built">crate built</option>
                  <option value="recorded">recorded</option>
                  <option value="published">published</option>
                </select>
                <textarea name="notes" placeholder="episode notes" className="field min-h-20 sm:col-span-2" />
                <button className="button sm:col-span-2">Create episode</button>
              </form>

              <div className="mt-5 grid gap-3">
                {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}
                {!episodes.length && <Empty text="No episodes yet. Create one and start attaching candidates." />}
              </div>
            </section>

            <section id="candidate-board" className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <SectionTitle eyebrow="candidate board" title={activeEpisode ? `Build: ${activeEpisode.title}` : "Pick tracks for the next crate."} />
              <form action={addCandidate} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}>
                  <option value="" disabled>episode</option>
                  {episodes.map((episode) => <option key={episode.id} value={episode.id}>{episode.episode_number ? `${episode.episode_number} · ` : ""}{episode.title}</option>)}
                </select>
                <select name="track_id" className="field" required>
                  <option value="">track</option>
                  {tracks.filter((track) => !track.id.startsWith("fallback")).map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}
                </select>
                <select name="status" className="field">
                  <option value="candidate">candidate</option>
                  <option value="selected">selected</option>
                  <option value="deferred">deferred</option>
                  <option value="rejected">rejected</option>
                  <option value="played">played</option>
                </select>
                <Input name="notes" placeholder="candidate note" className="sm:col-span-2" />
                <button className="button">Attach</button>
              </form>

              <div className="mt-5 grid gap-3">
                {tracks.map((track) => <TrackCard key={track.id} track={track} />)}
              </div>
            </section>
          </div>

          <section id="picodrops" className="mt-5 rounded-[2rem] border border-white/10 bg-[#1b100b]/78 p-5 backdrop-blur-xl">
            <SectionTitle eyebrow="PicoDrops sync layer" title="Downloaded files are first-class, not decoration." />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {tracks.flatMap((track) => (track.jarvis_picodrops_files ?? []).map((file) => ({ track, file }))).map(({ track, file }) => (
                <div key={`${track.id}-${file.local_path}`} className="rounded-3xl border border-[#0b786c]/30 bg-[#0b786c]/12 p-4">
                  <p className="font-serif text-2xl">{track.artist} — {track.title}</p>
                  <p className="mt-3 break-all text-sm text-[#a9efe2]/70">{file.local_path}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#a9efe2]/50">{file.downloaded_at ? new Date(file.downloaded_at).toLocaleString() : "downloaded"}</p>
                </div>
              ))}
              {!downloaded && <Empty text="No PicoDrops pairings yet. Add a local path on intake and Jarvis will track the file link." />}
            </div>
          </section>

          <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {inspirationSets.map((set) => (
              <a key={set.id} href={set.url} target="_blank" rel="noreferrer" className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 hover:border-[#ffbd70]/40">
                <p className="text-xs uppercase tracking-[0.28em] text-[#ffbd70]/55">{set.source_type}</p>
                <h3 className="mt-4 font-serif text-3xl leading-tight">{set.title}</h3>
                <p className="mt-2 text-sm text-[#f8d8a8]/55">{set.artist_or_channel}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#f8d8a8]/68">{set.flow_notes || set.notes || "No notes yet."}</p>
              </a>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4"><p className="font-serif text-4xl text-[#ffd08a]">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#f8d8a8]/55">{label}</p></div>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-xs uppercase tracking-[0.3em] text-[#ffbd70]/60">{eyebrow}</p><h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{title}</h2></div>;
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${className}`} />;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 text-sm leading-6 text-[#f8d8a8]/60">{text}</div>;
}

function EpisodeCard({ episode }: { episode: Episode }) {
  return <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-serif text-3xl">{episode.episode_number ? `${episode.episode_number} · ` : ""}{episode.title}</h3><span className="rounded-full bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#f8d8a8]/60">{episode.status.replace("_", " ")}</span></div><p className="mt-3 text-sm text-[#f8d8a8]/60">{countCandidates(episode)} candidates · {countCandidates(episode, "selected")} selected</p>{episode.notes && <p className="mt-3 text-sm leading-6 text-[#f8d8a8]/70">{episode.notes}</p>}</article>;
}

function TrackCard({ track }: { track: Track }) {
  const tags = track.jarvis_track_tags ?? [];
  const links = track.jarvis_track_links ?? [];
  const picodrops = track.jarvis_picodrops_files ?? [];
  return <article className="rounded-3xl border border-white/10 bg-white/[0.055] p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-sm text-[#f3c98b]/60">{track.artist}</p><h3 className="font-serif text-3xl leading-tight">{track.title}</h3></div><span className="w-fit rounded-full border border-[#ffbd70]/25 bg-[#ffbd70]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#ffd79a]">{bucketLabel(track.rating_bucket)}</span></div>{track.notes && <p className="mt-3 text-sm leading-6 text-[#f8d8a8]/68">{track.notes}</p>}<div className="mt-4 flex flex-wrap gap-2">{tags.map(({ tag }) => <span key={tag} className="rounded-full bg-black/30 px-3 py-1 text-xs text-[#f8d8a8]/68">{tag}</span>)}{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="rounded-full bg-[#ff9f43]/15 px-3 py-1 text-xs text-[#ffd08a]">{link.type}</a>)}{!!picodrops.length && <span className="rounded-full bg-[#0b786c]/25 px-3 py-1 text-xs text-[#a9efe2]">PicoDrops paired</span>}</div></article>;
}
