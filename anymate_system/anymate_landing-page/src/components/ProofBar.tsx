export default function ProofBar(){
  return (
    <section className="mx-auto max-w-6xl mt-8">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
          ✅ Verified Benchmarks — packs list CVR/CTR when available
        </li>
        <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
          💸 Creator Split — 90/10 for founding creators (90 days)
        </li>
        <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
          ↩️ Refunds/Credits — if a pack doesn't lift CVR, we swap/credit
        </li>
      </ul>
    </section>
  );
}