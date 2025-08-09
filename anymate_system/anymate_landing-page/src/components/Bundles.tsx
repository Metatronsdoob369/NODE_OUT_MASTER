const bundles = [
  { title: 'Product Hunt Launch Pack', blurb: 'Hero + ad set + welcome emails with proven hooks.', price: '$79' },
  { title: 'ArchViz Client Pack', blurb: 'Outcomes-first LP sections + showcase grid + inquiry CTA.', price: '$59' },
  { title: 'Game Starter Pack', blurb: 'Store page hero + trailer copy + UA ad set.', price: '$69' },
];

export default function Bundles(){
  return (
    <section className="mx-auto max-w-6xl mt-12">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-white/90">Bundles (coming online)</h2>
        <a href="/waitlist" className="text-sm text-sky-300 hover:underline" data-evt="cta_waitlist_bundles">Join the drop →</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bundles.map((b, i) => (
          <article key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-36 rounded-lg border border-white/10 bg-[linear-gradient(90deg,var(--fire-1),var(--fire-2),var(--fire-3))] animate-flame" />
            <h3 className="text-white font-semibold mt-3">{b.title}</h3>
            <p className="text-white/70 text-sm mt-1">{b.blurb}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-white/80 text-sm">{b.price}</span>
              <a href="/waitlist" className="text-sm px-3 py-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/10" data-evt="preview_bundle">Preview</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}