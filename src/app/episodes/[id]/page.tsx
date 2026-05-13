import Link from "next/link";
import { addCandidate, attachInspirationToEpisode } from "../../actions";
import { getJarvisData } from "@/lib/jarvis";
import { attachedInspo, countCandidates, Empty, episodeLabel, Input, MixCard, Page, Panel, SectionHeader, Shell, STATUSES, TrackCard } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function EpisodeWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { episodes, inspirationSets, tracks } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const episode = episodes.find((item) => item.id === id);

  if (!episode) {
    return <Shell><Page><Panel className="p-6"><Link href="/" className="button inline-grid place-items-center">← all episodes</Link><div className="mt-8"><SectionHeader kicker="missing episode" title="that workspace isn’t available" body="the episode may have been deleted, or the link may be stale. head back to the episode stack and open the current workspace." /></div></Panel></Page></Shell>;
  }

  const mixes = attachedInspo(episode) ?? [];

  return <Shell><Page>
    <Link href="/" className="mb-3 inline-block rounded-full border border-white/18 px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/60 hover:border-[#ff4f2e] hover:text-[#ff6846]">← all episodes</Link>
    <Panel red className="p-5 sm:p-8">
      <div className="grid gap-7 xl:grid-cols-[1fr_360px] xl:items-end">
        <SectionHeader dark kicker="episode workspace" title={episodeLabel(episode)} body={episode.title && !episode.title.startsWith("Episode ") ? episode.title : "build the room: references first, candidates second, selected crate last."} />
        <div className="grid grid-cols-3 gap-2">
          <Metric value={countCandidates(episode)} label="candidates" />
          <Metric value={countCandidates(episode, "selected")} label="selected" />
          <Metric value={mixes.length} label="mix refs" />
        </div>
      </div>
    </Panel>

    <div className="mt-3 grid gap-3 xl:grid-cols-[.78fr_1.22fr]">
      <section className="grid content-start gap-3">
        <Panel className="p-4 sm:p-6">
          <SectionHeader kicker="1 / reference" title="what is this episode borrowing?" body="attach mixes that define pacing, texture, transitions, or emotional color. leave a note for what each one contributes." />
          <form action={attachInspirationToEpisode} className="mt-5 grid gap-2">
            <input type="hidden" name="episode_id" value={episode.id} />
            <select name="inspiration_set_id" className="field" required><option value="">choose a mix / set</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select>
            <Input name="notes" placeholder="what this mix contributes" />
            <button className="button">attach reference</button>
          </form>
          <div className="mt-5 grid gap-2">{mixes.map((set) => <MixCard key={set.id} set={set} compact />)}{!mixes.length && <Empty text="No references attached yet. Start here before judging tracks." />}</div>
        </Panel>

        <Panel className="p-4 sm:p-6">
          <SectionHeader kicker="2 / candidate" title="add a track with a job" body="don’t just dump tracks. give each one a rough role: opener, lift, left-turn, release, closer, maybe-bin." />
          <form action={addCandidate} className="mt-5 grid gap-2">
            <input type="hidden" name="episode_id" value={episode.id} />
            <select name="track_id" className="field" required><option value="">choose a track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select>
            <select name="status" className="field">{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
            <Input name="notes" placeholder="position / reason / transition idea" />
            <button className="button">add to episode</button>
          </form>
        </Panel>
      </section>

      <Panel className="p-4 sm:p-6">
        <SectionHeader kicker="3 / crate board" title="shape the yes pile" body="the full track pool is here for fast candidate adds. selected count is the crate signal; rejected/deferred keep the thinking visible instead of losing it." />
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {tracks.slice(0, 12).map((track) => <TrackCard key={track.id} track={track} />)}
          {!tracks.length && <Empty text="No tracks yet. Add tracks in the Tracks tab, then come back to build the episode." />}
        </div>
      </Panel>
    </div>
  </Page></Shell>;
}

function Metric({ value, label }: { value: number; label: string }) {
  return <div className="border border-black/16 bg-black/8 p-3"><p className="font-mono text-4xl font-black leading-none">{value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.18em] opacity-60">{label}</p></div>;
}
