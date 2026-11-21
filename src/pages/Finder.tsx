import { useState } from "react";
import { Link } from "react-router-dom";
import { BikeVisual } from "../components/BikeVisual";
import { Answers, budgetRanges, inr, recommend, usePageMeta, waLink } from "../lib/utils";

const steps: { key: keyof Answers; q: string; opts: string[] }[] = [
  { key: "budget", q: "What is your budget?", opts: budgetRanges.map(r => r[2]) },
  { key: "use", q: "What is your primary use?", opts: ["Daily commute", "College", "Touring", "Sports riding", "Family use"] },
  { key: "priority", q: "What matters most?", opts: ["Mileage", "Performance", "Comfort", "Style", "Low maintenance"] },
  { key: "category", q: "Preferred category?", opts: ["Any", "Scooter", "Commuter", "Sport", "Cruiser", "Adventure"] }
];
export default function Finder() {
  usePageMeta("Find My Perfect Bike", "Answer four questions and get three bike recommendations with reasons.");
  const [i, setI] = useState(0); const [a, setA] = useState<Partial<Answers>>({});
  const done = i >= steps.length;
  const pick = (idx: number, v: string) => { setA({ ...a, [steps[i].key]: steps[i].key === "budget" ? idx : v }); setI(i + 1); };
  const results = done ? recommend(a as Answers) : [];
  return (
    <div className="wrap py-12 max-w-3xl">
      <h1 className="h2">Find my perfect bike</h1>
      {!done ? (
        <section className="mt-8" aria-live="polite">
          <div className="h-1 bg-white/10 rounded"><div className="h-1 bg-ember rounded transition-all" style={{ width: `${(i / steps.length) * 100}%` }} /></div>
          <p className="mt-4 text-sm text-white/60">Question {i + 1} of {steps.length}</p>
          <h2 className="text-2xl font-bold mt-1">{steps[i].q}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{steps[i].opts.map((o, idx) => <button key={o} onClick={() => pick(idx, o)} className="text-left rounded-lg border border-white/15 bg-ink-800 p-4 hover:border-ember transition">{o}</button>)}</div>
          {i > 0 && <button className="mt-5 text-sm text-white/60 underline" onClick={() => setI(i - 1)}>Back</button>}
        </section>
      ) : (
        <section className="mt-8 space-y-5">
          <p className="text-white/70">Your top {results.length} matches, based on your answers and the sample inventory.</p>
          {results.map(({ bike, why }, n) => (
            <article key={bike.id} className="grid sm:grid-cols-[220px_1fr] gap-4 rounded-lg border border-white/10 bg-ink-800 overflow-hidden">
              <BikeVisual bike={bike} className="w-full bg-ink-700" />
              <div className="p-4"><p className="text-sm text-ember font-semibold">Match {n + 1}</p><h3 className="font-display text-3xl font-extrabold uppercase">{bike.brand} {bike.model}</h3><p className="font-bold">{inr(bike.price)} <span className="text-xs font-normal text-white/50">indicative</span></p>
                <p className="mt-2 text-white/75">Recommended for you because it {why.length ? why.slice(0, 3).join(", ").replace(/, ([^,]*)$/, " and $1") : "is one of the closest matches in the current inventory"}.</p>
                <div className="mt-3 flex gap-2 flex-wrap"><Link to={`/bikes/${bike.id}`} className="btn btn-primary !py-2">View details</Link><a href={waLink("General enquiry", { bike })} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2">Enquire on WhatsApp</a></div></div>
            </article>
          ))}
          <button className="btn btn-ghost" onClick={() => { setI(0); setA({}); }}>Start again</button>
        </section>
      )}
    </div>
  );
}
