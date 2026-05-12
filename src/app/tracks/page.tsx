import { addCandidate, addTrack } from "../actions";
import { getJarvisData } from "@/lib/jarvis";
import { Empty, episodeLabel, Input, Page, Panel, Shell, Title, TrackCard } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function TracksPage() {
  const { tracks, episodes } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];
  return <Shell><Page>
    <Panel red className="p-5 sm:p-8"><p className="text-sm font-black uppercase tracking-[.22em] text-black/60">tracks / drops</p><h1 className="mt-4 max-w-5xl font-serif text-[4rem] font-black leading-[.82] tracking-[-.08em] text-black sm:text-[7rem]">library with PicoDrops memory.</h1></Panel>
    <div className="mt-3 grid gap-3 xl:grid-cols-[.8fr_1.2fr]">
      <Panel className="p-4 sm:p-6"><p className="label">add track</p><form action={addTrack} className="mt-5 grid gap-2 sm:grid-cols-2"><Input name="artist" placeholder="artist" required /><Input name="title" placeholder="title" required /><Input name="source_url" placeholder="spotify / youtube / soundcloud url" className="sm:col-span-2" /><Input name="local_path" placeholder="PicoDrops local path" className="sm:col-span-2" /><select name="rating_bucket" className="field"><option value="unrated">unrated</option><option value="must_play">must play</option><option value="maybe">maybe</option><option value="archive">archive</option></select><Input name="tags" placeholder="opener, warmup, bridge" /><textarea name="notes" placeholder="why it belongs" className="field min-h-24 sm:col-span-2" /><button className="button sm:col-span-2">add track</button></form></Panel>
      <Panel className="p-4 sm:p-6"><p className="label">attach to active episode</p><Title>{activeEpisode ? episodeLabel(activeEpisode) : "no episode"}</Title><form action={addCandidate} className="mt-5 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="track_id" className="field" required><option value="">track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select><select name="status" className="field"><option value="candidate">candidate</option><option value="selected">selected</option><option value="deferred">deferred</option><option value="rejected">rejected</option><option value="played">played</option></select><Input name="notes" placeholder="position / reason" /><button className="button">add candidate</button></form></Panel>
    </div>
    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{tracks.map((track) => <TrackCard key={track.id} track={track} />)}{!tracks.length && <Empty text="No tracks yet." />}</div>
  </Page></Shell>;
}
