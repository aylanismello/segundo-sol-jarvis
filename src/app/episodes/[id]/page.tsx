import Link from "next/link";
import { addCandidate, attachInspirationToEpisode } from "../../actions";
import { getJarvisData } from "@/lib/jarvis";
import { attachedInspo, countCandidates, Empty, episodeLabel, Input, MixCard, Page, Panel, Shell, TrackCard } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function EpisodeWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { episodes, inspirationSets, tracks } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const episode = episodes.find((item) => item.id === id) ?? episodes[0];
  const mixes = attachedInspo(episode) ?? [];

  return <Shell><Page>
    <Link href="/" className="mb-3 inline-block border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/60 hover:border-[#ff3826] hover:text-[#ff3826]">← all episodes</Link>
    <Panel red className="p-5 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[.22em] text-black/60">episode workspace</p>
      <h1 className="mt-4 max-w-5xl font-serif text-[4rem] font-black leading-[.82] tracking-[-.08em] text-black sm:text-[7rem]">{episodeLabel(episode)}</h1>
      <div className="mt-8 grid gap-2 sm:grid-cols-3"><Metric value={countCandidates(episode)} label="candidates" /><Metric value={countCandidates(episode, "selected")} label="selected" /><Metric value={mixes.length} label="mix refs" /></div>
    </Panel>
    <div className="mt-3 grid gap-3 xl:grid-cols-2">
      <Panel className="p-4 sm:p-6"><p className="label">attach mix from inspo pile</p><form action={attachInspirationToEpisode} className="mt-5 grid gap-2"><input type="hidden" name="episode_id" value={episode?.id} /><select name="inspiration_set_id" className="field" required><option value="">mix</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select><Input name="notes" placeholder="what this mix contributes" /><button className="button">attach mix</button></form><div className="mt-5 grid gap-2">{mixes.map((set) => <MixCard key={set.id} set={set} compact />)}{!mixes.length && <Empty text="No mixes attached yet." />}</div></Panel>
      <Panel className="p-4 sm:p-6"><p className="label">attach track candidate</p><form action={addCandidate} className="mt-5 grid gap-2"><input type="hidden" name="episode_id" value={episode?.id} /><select name="track_id" className="field" required><option value="">track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select><select name="status" className="field"><option value="candidate">candidate</option><option value="selected">selected</option><option value="deferred">deferred</option><option value="rejected">rejected</option><option value="played">played</option></select><Input name="notes" placeholder="position / reason" /><button className="button">add candidate</button></form><div className="mt-5 grid gap-2">{tracks.slice(0,8).map((track) => <TrackCard key={track.id} track={track} />)}{!tracks.length && <Empty text="No tracks yet. Add them in Tracks." />}</div></Panel>
    </div>
  </Page></Shell>;
}
function Metric({ value, label }: { value: number; label: string }) { return <div className="border border-black/20 bg-black/10 p-3"><p className="font-mono text-4xl font-black">{value}</p><p className="text-[10px] font-black uppercase tracking-[.18em] opacity-60">{label}</p></div>; }
