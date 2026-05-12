const tracks = [
  {
    artist: "Domenique Dumont",
    title: "People On Sunday",
    bucket: "must play",
    tags: ["opener", "warmup", "sunlit"],
    source: "YouTube",
    downloaded: true,
    note: "soft-motion entry point, warm enough to open the garden.",
  },
  {
    artist: "Nicola Cruz",
    title: "Cumbia del Olvido",
    bucket: "maybe",
    tags: ["bridge", "earth", "groover"],
    source: "Spotify",
    downloaded: false,
    note: "good mid-set gravity if the room wants percussion.",
  },
  {
    artist: "Auntie Flo",
    title: "Cape Town Jam",
    bucket: "must play",
    tags: ["banger", "left-turn"],
    source: "SoundCloud",
    downloaded: true,
    note: "keeps the set playful without breaking the Segundo Sol spell.",
  },
];

const inspiration = [
  "Floating Points — warm outdoor selections",
  "Bonobo Boiler Room — patient melodic arc",
  "Gilles Peterson Brazil special — percussion, air, sunlight",
];

const episodes = [
  { number: "001", title: "First Light", status: "planning", candidates: 18, selected: 7 },
  { number: "002", title: "Afterglow Study", status: "crate built", candidates: 23, selected: 14 },
];

const statCards = [
  ["42", "tracks collected"],
  ["11", "must plays"],
  ["7", "PicoDrops paired"],
  ["14 days", "default window"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#130d09] text-[#fff4df]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,156,67,0.35),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(11,120,108,0.2),transparent_30%),linear-gradient(135deg,#130d09_0%,#24120b_46%,#4f2010_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-5 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[#ff9f43] text-lg text-[#1b0d08] shadow-[0_0_35px_rgba(255,159,67,.55)]">☀︎</div>
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-[#f3c98b]/70">Segundo Sol</p>
              <h1 className="font-serif text-xl tracking-tight">Jarvis</h1>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-[#f7d9aa]/75 md:flex">
            <a href="#tracks">Tracks</a>
            <a href="#inspiration">Inspiration</a>
            <a href="#episodes">Episodes</a>
          </div>
        </nav>

        <header className="grid min-h-[560px] items-center gap-10 py-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-[#ffbd70]/25 bg-[#ffbd70]/10 px-4 py-2 text-sm text-[#ffd79a] shadow-[0_0_45px_rgba(255,159,67,.18)]">
              set-planning cockpit · not a playback app
            </div>
            <div className="space-y-5">
              <h2 className="max-w-4xl font-serif text-6xl leading-[0.9] tracking-[-0.06em] text-[#fff6e6] sm:text-7xl lg:text-8xl">
                Build the next Segundo Sol session from the glow outward.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-[#f8d8a8]/78 sm:text-xl">
                Collect discoveries, keep an inspiration diary, rate tracks into human decision buckets, and shape the next Rekordbox crate with calm intention.
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                  <p className="font-serif text-3xl text-[#ffd08a]">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#f8d8a8]/55">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#ff8a2a]/20 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/12 bg-[#21100a]/75 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-[#ffd08a]/15 bg-[#100b08]/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#ffbd70]/60">current episode</p>
                    <h3 className="mt-1 font-serif text-3xl">First Light</h3>
                  </div>
                  <span className="rounded-full bg-[#ff9f43] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1b0d08]">planning</span>
                </div>
                <div className="space-y-3">
                  {tracks.map((track) => (
                    <article key={track.title} className="group rounded-3xl border border-white/10 bg-white/[0.055] p-4 transition hover:border-[#ffbd70]/40 hover:bg-white/[0.08]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-[#f3c98b]/60">{track.artist}</p>
                          <h4 className="mt-1 font-serif text-2xl text-[#fff4df]">{track.title}</h4>
                        </div>
                        <span className="rounded-full border border-[#ffbd70]/25 bg-[#ffbd70]/10 px-3 py-1 text-xs text-[#ffd79a]">{track.bucket}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#f8d8a8]/68">{track.note}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {track.tags.map((tag) => <span key={tag} className="rounded-full bg-black/30 px-3 py-1 text-xs text-[#f8d8a8]/70">{tag}</span>)}
                        <span className="rounded-full bg-[#0b786c]/20 px-3 py-1 text-xs text-[#9ee8dc]">{track.source}</span>
                        {track.downloaded && <span className="rounded-full bg-[#ff9f43]/20 px-3 py-1 text-xs text-[#ffd08a]">PicoDrops</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="tracks" className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#ffbd70]/60">capture</p>
            <h3 className="mt-3 font-serif text-4xl">Fast add, slow taste.</h3>
            <p className="mt-4 leading-7 text-[#f8d8a8]/70">Paste a Spotify, YouTube, SoundCloud, PicoDrops, or manual reference. Jarvis keeps the metadata layer clean while you stay in selector brain.</p>
            <div className="mt-6 rounded-2xl border border-dashed border-[#ffbd70]/25 bg-black/20 p-4 text-[#f8d8a8]/58">artist · title · rating bucket · optional tags · notes · download state</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {['must play', 'maybe', 'archive'].map((bucket) => (
              <div key={bucket} className="rounded-[2rem] border border-white/10 bg-[#1d100b]/70 p-5 shadow-xl shadow-black/20">
                <p className="font-serif text-3xl capitalize text-[#ffd08a]">{bucket}</p>
                <p className="mt-3 text-sm leading-6 text-[#f8d8a8]/65">Decision bucket first. No fake precision, no five-star anxiety.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="inspiration" className="grid gap-5 lg:grid-cols-3">
          {inspiration.map((set, index) => (
            <div key={set} className="min-h-56 rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,159,67,.16),rgba(255,255,255,.045))] p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ffbd70]/60">inspiration 0{index + 1}</p>
              <h3 className="mt-5 font-serif text-3xl leading-tight">{set}</h3>
              <p className="mt-5 text-sm leading-6 text-[#f8d8a8]/65">flow notes, mood references, transition ideas, and specific track sparks live here.</p>
            </div>
          ))}
        </section>

        <section id="episodes" className="mb-10 rounded-[2.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#ffbd70]/60">episodes</p>
              <h3 className="mt-2 font-serif text-4xl">Candidate pools for every sun cycle.</h3>
            </div>
            <button className="rounded-full bg-[#fff4df] px-5 py-3 text-sm font-semibold text-[#21100a] shadow-[0_0_35px_rgba(255,244,223,.25)]">New episode</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {episodes.map((episode) => (
              <article key={episode.number} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-5xl text-[#ffd08a]">{episode.number}</p>
                  <span className="rounded-full bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f8d8a8]/65">{episode.status}</span>
                </div>
                <h4 className="mt-5 font-serif text-3xl">{episode.title}</h4>
                <p className="mt-3 text-sm text-[#f8d8a8]/65">{episode.candidates} candidates · {episode.selected} selected for manual Rekordbox build</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
