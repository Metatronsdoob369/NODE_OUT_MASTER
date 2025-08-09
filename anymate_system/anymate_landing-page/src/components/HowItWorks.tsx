const steps = [
  { n: 1, t: 'Generate', d: 'Brief in. Create ad sets, LP sections, emails.' },
  { n: 2, t: 'Gate', d: 'Auto-checks: clarity, proof, UVs/LODs/maps if 3D.' },
  { n: 3, t: 'Publish / Buy', d: 'List as a pack or buy verified packs.' },
  { n: 4, t: 'Iterate', d: 'Benchmarks + analytics guide the next rev.' }
];

export default function HowItWorks(){
  return (
    <section className="mx-auto max-w-6xl mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-semibold text-white/90 mb-4">How it works</h2>
      <ol className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map(s => (
          <li key={s.n} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-white/60 text-sm">Step {s.n}</div>
            <div className="text-white font-semibold mt-1">{s.t}</div>
            <p className="text-white/70 text-sm mt-2">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}