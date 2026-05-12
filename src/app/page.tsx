import Link from "next/link";
import { addEpisode } from "./actions";
import { getJarvisData } from "@/lib/jarvis";
import { countCandidates, Empty, episodeLabel, Input, Page, Panel, Shell } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { episodes } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));

  return <Shell><Page>
    <div className="grid gap-3 xl:grid-cols-[420px_1fr]">
      <Panel red className="p-4 sm:p-7 xl:sticky xl:top-5 xl:h-[calc(100vh-2.5rem)]">
        <p className="text-xs font-black uppercase tracking-[.2em] text-black/60">episode stack</p>
        <h1 className="mt-4 max-w-md font-serif text-[3.15rem] font-black leading-[.82] tracking-[-.075em] text-black sm:text-[5.4rem]">make one. open one. build one.</h1>
        <p className="mt-5 max-w-sm text-sm font-bold leading-6 text-black/60">front door = episodes. create a blank episode, then work inside that episode only.</p>
        <form action={addEpisode} className="mt-6 grid gap-2">
          <Input name="episode_number" placeholder="episode # optional" />
          <Input name="title" placeholder="optional name / leave blank" />
          <input type="hidden" name="status" value="planning" />
          <button className="button border-black bg-black text-[#ff3826] hover:border-white hover:bg-white">new episode</button>
        </form>
      </Panel>

      <section className="grid content-start gap-3">
        <div className="border border-white/15 bg-[#101010] p-4 sm:p-5">
          <p className="label">all episodes</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">this is the front door. create an episode, then open it into its own workspace for mixes, tracks, candidates, and PicoDrops.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {episodes.map((episode) => (
            <Link key={episode.id} href={`/episodes/${episode.id}`} className="group min-h-64 border border-white/15 bg-[#0d0d0d] p-5 hover:border-[#ff3826] hover:bg-[#ff3826] hover:text-black">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-black uppercase tracking-[.18em] opacity-55">{episode.status.replace("_", " ")}</p>
                <span className="border border-current px-2 py-1 text-[10px] font-black uppercase tracking-[.16em]">open</span>
              </div>
              <h2 className="mt-10 font-serif text-5xl leading-[.86] tracking-[-.06em]">{episodeLabel(episode)}</h2>
              {episode.title && !episode.title.startsWith("Episode ") && <p className="mt-3 text-sm font-bold opacity-60">{episode.title}</p>}
              <div className="mt-8 grid grid-cols-3 gap-2 text-center font-mono text-sm font-black">
                <div className="border border-current/20 p-2"><p className="text-2xl">{countCandidates(episode)}</p><p className="text-[9px] uppercase tracking-[.14em] opacity-55">candidates</p></div>
                <div className="border border-current/20 p-2"><p className="text-2xl">{countCandidates(episode, "selected")}</p><p className="text-[9px] uppercase tracking-[.14em] opacity-55">selected</p></div>
                <div className="border border-current/20 p-2"><p className="text-2xl">{episode.jarvis_episode_inspiration_sets?.length ?? 0}</p><p className="text-[9px] uppercase tracking-[.14em] opacity-55">mixes</p></div>
              </div>
            </Link>
          ))}
          {!episodes.length && <Empty text="No episodes yet. Create one on the left. No name required." />}
        </div>
      </section>
    </div>
  </Page></Shell>;
}
