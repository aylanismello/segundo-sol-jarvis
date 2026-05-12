import Link from "next/link";
import { addCandidate, addEpisode, attachInspirationToEpisode } from "./actions";
import { getJarvisData } from "@/lib/jarvis";
import { attachedInspo, countCandidates, Empty, EpisodeCard, episodeLabel, Input, MixCard, Page, Panel, Shell, Stat, Title, TrackCard } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const { tracks, inspirationSets, episodes } = data;
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];
  const episodeInspo = attachedInspo(activeEpisode) ?? [];
  const downloaded = tracks.filter((track) => (track.jarvis_picodrops_files?.length ?? 0) > 0).length;

  return <Shell><Page>
    <div className="grid gap-3 xl:grid-cols-[1.25fr_.75fr]">
      <Panel red className="min-h-[420px] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/70"><span className="bg-black px-2 py-1 text-[#ff3826]">now planning</span><span>{activeEpisode?.status.replace("_", " ") ?? "create one"}</span></div>
        <div className="mt-12"><p className="text-sm font-black uppercase tracking-[0.25em] text-black/55">current workspace</p><h1 className="mt-2 max-w-5xl font-serif text-[4.5rem] font-black leading-[0.82] tracking-[-0.08em] text-black sm:text-[7rem] lg:text-[9rem]">{episodeLabel(activeEpisode)}</h1></div>
        <div className="mt-8 grid gap-2 sm:grid-cols-4"><Stat dark value={countCandidates(activeEpisode)} label="candidates" /><Stat dark value={countCandidates(activeEpisode, "selected")} label="selected" /><Stat dark value={episodeInspo.length} label="mix refs" /><Stat dark value={downloaded} label="drops" /></div>
      </Panel>
      <Panel className="grid content-between gap-4 p-4 sm:p-6">
        <div><p className="label">what next?</p><Title>Choose the room.</Title></div>
        <div className="grid gap-2"><Link className="button text-center" href="/episodes">work episode</Link><Link className="button text-center" href="/inspo">manage inspo pile</Link><Link className="button text-center" href="/tracks">track / PicoDrops library</Link></div>
      </Panel>
    </div>

    <div className="mt-3 grid gap-3 xl:grid-cols-3">
      <Panel className="p-4 sm:p-6"><p className="label">create episode</p><form action={addEpisode} className="mt-4 grid gap-2"><Input name="episode_number" placeholder="episode # optional" /><Input name="title" placeholder="optional title / leave blank" /><select name="status" className="field"><option value="planning">planning</option><option value="crate_built">crate built</option><option value="recorded">recorded</option><option value="published">published</option></select><button className="button">new episode</button></form></Panel>
      <Panel className="p-4 sm:p-6"><p className="label">attach inspo to current episode</p><form action={attachInspirationToEpisode} className="mt-4 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="inspiration_set_id" className="field" required><option value="">mix from inspo pile</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select><button className="button">attach mix</button></form></Panel>
      <Panel className="p-4 sm:p-6"><p className="label">send track to episode</p><form action={addCandidate} className="mt-4 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="track_id" className="field" required><option value="">track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.artist} — {track.title}</option>)}</select><button className="button">add candidate</button></form></Panel>
    </div>

    <div className="mt-3 grid gap-3 xl:grid-cols-[.7fr_1.3fr]"><Panel className="p-4 sm:p-6"><p className="label">episode stack</p><div className="mt-4 grid gap-2">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} active={episode.id === activeEpisode?.id} />)}{!episodes.length && <Empty text="Create an episode. No name needed." />}</div></Panel><Panel className="p-4 sm:p-6"><p className="label">attached inspiration</p><div className="mt-4 grid gap-2 md:grid-cols-2">{episodeInspo.map((set) => <MixCard key={set.id} set={set} compact />)}{!episodeInspo.length && <Empty text="Attach mixes from the inspo pile so the episode has a mood board." />}</div></Panel></div>
    <div className="mt-3 grid gap-3 xl:grid-cols-2"><Panel className="p-4 sm:p-6"><p className="label">latest inspo pile</p><div className="mt-4 grid gap-2">{inspirationSets.slice(0,4).map((set) => <MixCard key={set.id} set={set} compact />)}{!inspirationSets.length && <Empty text="No mixes yet." />}</div></Panel><Panel className="p-4 sm:p-6"><p className="label">recent tracks</p><div className="mt-4 grid gap-2">{tracks.slice(0,4).map((track) => <TrackCard key={track.id} track={track} />)}{!tracks.length && <Empty text="No tracks yet." />}</div></Panel></div>
  </Page></Shell>;
}
