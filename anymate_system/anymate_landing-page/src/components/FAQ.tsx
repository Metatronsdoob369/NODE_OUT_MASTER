const Q = [
  ['What license comes with a pack?',
   'Non-exclusive, perpetual commercial use on your projects. Resale outside the marketplace is not allowed.'],
  ['Do you allow refunds?',
   'If a pack doesn't improve your flow in 14 days, we'll swap or credit your account.'],
  ['How do creators get paid?',
   'Stripe Connect (Express). Payouts typically clear after a short refund window.'],
  ['Do you disclose AI usage?',
   'Yes. Listings include an AI disclosure and any provenance we have.']
];

export default function FAQ(){
  return (
    <section className="mx-auto max-w-4xl mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-semibold text-white/90 mb-4">FAQ</h2>
      <div className="divide-y divide-white/10 border border-white/10 rounded-xl bg-white/5">
        {Q.map(([q,a], i) => (
          <details key={i} className="p-4">
            <summary className="cursor-pointer text-white/90">{q}</summary>
            <p className="mt-2 text-white/70 text-sm">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}