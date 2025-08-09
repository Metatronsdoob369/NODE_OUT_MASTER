
type Item = { title: string; tag: string; price?: string; };
const items: Item[] = [
  { title: 'ArchViz: Interior Kit v1', tag: 'LP sections', price: '$39' },
  { title: 'Sci‑Fi Door Pack', tag: 'Kitbash', price: '$29' },
  { title: 'Parametric Stair Generator', tag: 'Blueprint', price: '$49' },
  { title: 'PBR Metals (12)', tag: 'Textures', price: '$19' },
  { title: 'Low‑Poly Props (30)', tag: 'Game', price: '$25' },
  { title: 'Facade Variants', tag: 'ArchViz', price: '$35' },
  { title: 'Greebles v2', tag: 'Kitbash', price: '$19' },
  { title: 'Lighting Rigs', tag: 'Tooling', price: '$15' },
];

function ThumbSVG(){
  // simple glowing gradient rect placeholder
  return (
    <svg viewBox="0 0 320 180" className="w-full h-40 rounded-lg border border-white/10">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--fire-1)" />
          <stop offset="50%" stopColor="var(--fire-2)" />
          <stop offset="100%" stopColor="var(--fire-3)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" fill="url(#g1)"></rect>
      <rect x="18" y="18" width="284" height="144" fill="rgba(0,0,0,0.45)" rx="10"></rect>
      <g opacity="0.8">
        <circle cx="70" cy="90" r="22" fill="url(#g1)" />
        <rect x="110" y="72" width="160" height="12" rx="6" fill="url(#g1)" />
        <rect x="110" y="98" width="120" height="12" rx="6" fill="url(#g1)" />
      </g>
    </svg>
  );
}

export default function AssetStrip(){
  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-white/90">Featured assets</h2>
        <a href="/waitlist" className="text-sm text-sky-300 hover:underline">Join the drop →</a>
      </div>
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-4 min-w-max">
          {items.map((it, i) => (
            <li key={i} className="w-72 shrink-0">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 hover:border-white/20 transition">
                <ThumbSVG />
                <div className="mt-3">
                  <div className="text-white/90 font-medium">{it.title}</div>
                  <div className="text-xs text-white/60">{it.tag}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-white/80">{it.price}</span>
                  <button className="text-sm px-3 py-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/10">Preview</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}