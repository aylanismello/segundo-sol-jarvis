import { addInspirationSet, attachInspirationToEpisode } from "../actions";
import { getJarvisData } from "@/lib/jarvis";
import { Empty, episodeLabel, Input, MixCard, Page, Panel, Shell, Title } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function InspoPage() {
  const { inspirationSets, episodes } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];
  return <Shell><Page>
    <Panel red className="p-5 sm:p-8"><p className="text-sm font-black uppercase tracking-[.22em] text-black/60">inspo pile</p><h1 className="mt-4 max-w-5xl font-serif text-[4rem] font-black leading-[.82] tracking-[-.08em] text-black sm:text-[7rem]">collect mixes first. attach later.</h1></Panel>
    <div className="mt-3 grid gap-3 xl:grid-cols-[.8fr_1.2fr]">
      <Panel className="p-4 sm:p-6"><p className="label">add YouTube / SoundCloud / Mixcloud</p><form action={addInspirationSet} className="mt-5 grid gap-2"><Input name="title" placeholder="mix title" required /><Input name="artist_or_channel" placeholder="DJ / channel" /><Input name="url" placeholder="url" required /><textarea name="flow_notes" placeholder="arc, pace, mood, texture" className="field min-h-24" /><textarea name="notes" placeholder="specific tracks / notes" className="field min-h-24" /><button className="button">add to inspo pile</button></form></Panel>
      <Panel className="p-4 sm:p-6"><p className="label">attach to episode</p><Title>{activeEpisode ? episodeLabel(activeEpisode) : "no active episode"}</Title><form action={attachInspirationToEpisode} className="mt-5 grid gap-2"><select name="episode_id" className="field" required defaultValue={activeEpisode?.id ?? ""}><option value="" disabled>episode</option>{episodes.map((episode) => <option key={episode.id} value={episode.id}>{episodeLabel(episode)}</option>)}</select><select name="inspiration_set_id" className="field" required><option value="">mix from pile</option>{inspirationSets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}</select><Input name="notes" placeholder="what this mix contributes" /><button className="button">attach</button></form></Panel>
    </div>
    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{inspirationSets.map((set) => <MixCard key={set.id} set={set} />)}{!inspirationSets.length && <Empty text="No inspo yet." />}</div>
  </Page></Shell>;
}
