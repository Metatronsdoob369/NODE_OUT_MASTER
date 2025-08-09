
export default function Wordmark(){
  return (
    <div className="select-none leading-none font-extrabold tracking-tight">
      <span className="text-2xl md:text-3xl bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--fire-1),var(--fire-2),var(--fire-3))] animate-flame">
        ANYM
      </span>
      <sup className="align-super ml-0.5 inline-block">
        <span className="inline-block text-lg md:text-xl bg-clip-text text-transparent bg-[linear-gradient(180deg,var(--fire-3),var(--fire-2),var(--fire-1))] animate-flicker">8</span>
      </sup>
    </div>
  );
}