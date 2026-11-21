import { useState } from "react";
import { HardHat, Shirt, Hand, Briefcase, Wrench, ShieldCheck } from "lucide-react";
import { accCategories, accessories, AccCategory } from "../data/accessories";
import { inr, usePageMeta, waLink } from "../lib/utils";

const icons: Record<AccCategory, typeof HardHat> = { Helmets: HardHat, "Riding jackets": Shirt, Gloves: Hand, Luggage: Briefcase, "Bike accessories": Wrench, "Safety gear": ShieldCheck };
export default function Accessories() {
  usePageMeta("Accessories", "Helmets, jackets, gloves, luggage and safety gear. Enquire on WhatsApp.");
  const [cat, setCat] = useState<string>("");
  const list = accessories.filter(a => !cat || a.category === cat);
  return (
    <div className="wrap py-10">
      <h1 className="h2">Accessories</h1><p className="text-white/60 mt-2">All prices are indicative. Ask the showroom for current prices and availability.</p>
      <div className="mt-6 flex flex-wrap gap-2">{["", ...accCategories].map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full px-4 py-2 text-sm border ${cat === c ? "bg-ember border-ember" : "border-white/20"}`}>{c || "All"}</button>)}</div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map(a => { const I = icons[a.category]; return (
        <article key={a.id} className="rounded-lg border border-white/10 bg-ink-800 overflow-hidden">
          <div className="grid place-items-center h-36 bg-gradient-to-br from-ink-600 to-ink-700"><I className="h-14 w-14 text-white/70" strokeWidth={1.2} /></div>
          <div className="p-4"><p className="text-xs text-white/50">{a.category}</p><h3 className="font-semibold">{a.name}</h3><p className="mt-1 font-bold">{inr(a.price)} <span className="text-xs font-normal text-white/50">indicative</span></p>
            <a className="btn btn-ghost w-full mt-3 !py-2" target="_blank" rel="noreferrer" href={waLink("Accessories enquiry", { lines: [`Item: ${a.name} (${a.category})`, `Price shown on website: ${inr(a.price)} (indicative)`] })}>Enquire on WhatsApp</a></div>
        </article>); })}</div>
    </div>
  );
}
