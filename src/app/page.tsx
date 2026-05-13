import Link from "next/link";
import { addEpisode } from "./actions";
import { getJarvisData } from "@/lib/jarvis";
import { countCandidates, Empty, episodeLabel, Input, Page, Panel, SectionHeader, Shell, Stat } from "@/components/jarvis-ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { episodes, tracks, inspirationSets } = await getJarvisData().catch(() => ({ tracks: [], inspirationSets: [], episodes: [] }));
  const activeEpisode = episodes.find((episode) => episode.status === "planning") ?? episodes[0];

  return <Shell><Page>
    <div className="grid gap-3 xl:grid-cols-[minmax(360px,520px)_1fr]">
      <Panel red className="p-5 sm:p-8 xl:sticky xl:top-5 xl:h-[calc(100vh-2.5rem)]">
        <SectionHeader dark kicker="segundo sol jarvis" title="turn the pile into an episode." body="one place to catch mixes, mark track candidates, shape the arc, and keep every episode moving from loose inspiration to playable crate." />
        <div className="mt-8 grid grid-cols-3 gap-2">
          <Stat dark value={episodes.length} label="episodes" />
          <Stat dark value={inspirationSets.length} label="mix refs" />
          <Stat dark value={tracks.length} label="tracks" />
        </div>
        <form action={addEpisode} className="mt-8 grid gap-2 rounded-2xl border border-black/12 bg-black/[.06] p-3">
          <p className="text-[11px] font-black uppercase tracking-[.18em] text-black/55">start a workspace</p>
          <Input name="episode_number" placeholder="episode # optional" className="border-black/15 bg-[#f4efe4] text-black placeholder:text-black/35 focus:border-black" />
          <Input name="title" placeholder="working title / intention" className="border-black/15 bg-[#f4efe4] text-black placeholder:text-black/35 focus:border-black" />
          <input type="hidden" name="status" value="planning" />
          <button className="button border-black bg-black text-[#ff6846] hover:border-white hover:bg-white">create + open</button>
        </form>
        {activeEpisode && <Link href={`/episodes/${activeEpisode.id}`} className="mt-3 block rounded-2xl border border-black/15 bg-black px-4 py-4 text-[#f4efe4] hover:bg-[#f4efe4] hover:text-black"><p className="text-[10px] font-black uppercase tracking-[.18em] opacity-55">resume active build</p><p className="mt-2 font-serif text-3xl leading-none tracking-[-.045em]">{episodeLabel(activeEpisode)}</p></Link>}
      </Panel>

      <section className="grid content-start gap-3">
        <Panel className="p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeader kicker="episode stack" title="choose the room you’re building in" body="episodes are the container. open one, attach the references, then make candidate decisions inside that context instead of juggling loose notes." />
            <Link href="/episodes" className="button grid place-items-center text-center">full workspace</Link>
          </div>
        </Panel>
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {episodes.map((episode) => (
            <Link key={episode.id} href={`/episodes/${episode.id}`} className="group min-h-64 border border-white/14 bg-[#11100d]/92 p-5 hover:border-[#ff4f2e] hover:bg-[#ff4f2e] hover:text-black">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-black uppercase tracking-[.18em] opacity-55">{episode.status.replace("_", " ")}</p>
                <span className="rounded-full border border-current px-3 py-1 text-[10px] font-black uppercase tracking-[.16em]">open</span>
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
