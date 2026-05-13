import { addCandidate, addEpisode, attachInspirationToEpisode } from "../actions";
import { getJarvisData } from "@/lib/jarvis";
import { attachedInspo, countCandidates, Empty, EpisodeCard, episodeLabel, Input, MixCard, Page, Panel, SectionHeader, Shell, Stat, TrackCard } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function EpisodesPage() {
  const { tracks, inspirationSets, episodes } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];
  const episodeInspo = attachedInspo(activeEpisode) ?? [];

  return <Shell><Page>
    <Panel red className="p-5 sm:p-8">
      <div className="grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
        <SectionHeader dark kicker="command center" title={episodeLabel(activeEpisode)} body="a wider view for batch work: make episodes, attach references, and add tracks without leaving the dashboard." />
        <div className="grid grid-cols-3 gap-2"><Stat dark value={countCandidates(activeEpisode)} label="candidates" /><Stat dark value={countCandidates(activeEpisode, "selected")} label="selected" /><Stat dark value={episodeInspo.length} label="mix refs" /></div>
      </div>
    </Panel>

    <div className="mt-3 grid gap-3 xl:grid-cols-3">
      <Panel className="p-4 sm:p-6"><SectionHeader kicker="new room" title="start episode" /><form action={addEpisode} className="mt-5 grid gap-2"><Input name="episode_number" placeholder="episode # optional" /><Input name="title" placeholder="working title / intention" /><select name="status" className="field"><option value="planning">planning</option><option value="crate_built">crate built</option><option value="recorded">recorded</option><option value="published">published</option></select><button className="button">create + open</button></form></Panel>
      <Panel className="p-4 sm:p-6"><SectionHeader kicker="reference" title="attach inspo" /><form action={attachInspirationToEpisode} className="mt-5 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="inspiration_set_id" className="field" required><option value="">mix</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select><button className="button">attach</button></form></Panel>
      <Panel className="p-4 sm:p-6"><SectionHeader kicker="candidate" title="add track" /><form action={addCandidate} className="mt-5 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="track_id" className="field" required><option value="">track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select><button className="button">candidate</button></form></Panel>
    </div>

    <div className="mt-3 grid gap-3 xl:grid-cols-[.65fr_1.35fr]">
      <Panel className="p-4 sm:p-6"><SectionHeader kicker="episode stack" title="all rooms" /><div className="mt-4 grid gap-2">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} active={episode.id === activeEpisode?.id} />)}{!episodes.length && <Empty text="No episodes yet." />}</div></Panel>
      <div className="grid gap-3">
        <Panel className="p-4 sm:p-6"><SectionHeader kicker="active references" title="mood board" /><div className="mt-4 grid gap-2 md:grid-cols-2">{episodeInspo.map((set) => <MixCard key={set.id} set={set} compact />)}{!episodeInspo.length && <Empty text="No mixes attached yet." />}</div></Panel>
        <Panel className="p-4 sm:p-6"><SectionHeader kicker="source pool" title="recent tracks" /><div className="mt-4 grid gap-2 md:grid-cols-2">{tracks.slice(0,8).map((track) => <TrackCard key={track.id} track={track} />)}{!tracks.length && <Empty text="No tracks yet." />}</div></Panel>
      </div>
    </div>
  </Page></Shell>;
}
