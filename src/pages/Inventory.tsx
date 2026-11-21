import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, X } from "lucide-react";
import { bikes, categories } from "../data/bikes";
import { BikeCard } from "../components/BikeCard";
import { inr, usePageMeta } from "../lib/utils";

const brands = [...new Set(bikes.map(b => b.brand))].sort();
export default function Inventory() {
  usePageMeta("Explore Bikes", "Filter and sort motorcycles and scooters by brand, price, engine and mileage.");
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "", cat = sp.get("cat") || "", sort = sp.get("sort") || "popular";
  const [brand, setBrand] = useState(""), [maxP, setMaxP] = useState(400000), [cc, setCc] = useState(""), [mil, setMil] = useState(0), [fuel, setFuel] = useState(""), [list, setList] = useState(false);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); };
  const ccOk = (c: number) => !cc || (cc === "u125" ? c < 125 : cc === "125" ? c >= 125 && c < 200 : cc === "200" ? c >= 200 && c < 350 : c >= 350);
  const res = useMemo(() => {
    const r = bikes.filter(b => (!q || `${b.brand} ${b.model} ${b.category} ${b.cc}cc ${b.cc}`.toLowerCase().includes(q.toLowerCase())) && (!cat || b.category === cat) && (!brand || b.brand === brand) && b.price <= maxP && ccOk(b.cc) && b.mileage >= mil && (!fuel || b.fuel === fuel));
    return [...r].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "new" ? b.year - a.year : Number(!!b.popular) - Number(!!a.popular));
  }, [q, cat, brand, maxP, cc, mil, fuel, sort]);
  const chips: [string, () => void][] = [];
  if (q) chips.push([`Search: ${q}`, () => set("q", "")]); if (cat) chips.push([cat, () => set("cat", "")]); if (brand) chips.push([brand, () => setBrand("")]);
  if (maxP < 400000) chips.push([`Up to ${inr(maxP)}`, () => setMaxP(400000)]); if (cc) chips.push([`Engine: ${{ u125: "under 125cc", "125": "125 to 199cc", "200": "200 to 349cc", "350": "350cc+" }[cc]}`, () => setCc("")]);
  if (mil) chips.push([`${mil}+ kmpl`, () => setMil(0)]); if (fuel) chips.push([fuel, () => setFuel("")]);
  const clear = () => { setSp({}); setBrand(""); setMaxP(400000); setCc(""); setMil(0); setFuel(""); };
  const sel = "input !py-2";
  return (
    <div className="wrap py-10">
      <h1 className="h2">Explore bikes</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 bg-ink-800 border border-white/10 rounded-lg p-4">
        <div className="sm:col-span-2 lg:col-span-4"><label className="label" htmlFor="q">Search</label><input id="q" className="input" placeholder="Bike, brand, category or cc" value={q} onChange={e => set("q", e.target.value)} /></div>
        <div><label className="label" htmlFor="cat">Category</label><select id="cat" className={sel} value={cat} onChange={e => set("cat", e.target.value)}><option value="">All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label" htmlFor="br">Brand</label><select id="br" className={sel} value={brand} onChange={e => setBrand(e.target.value)}><option value="">All</option>{brands.map(c => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label" htmlFor="cc">Engine capacity</label><select id="cc" className={sel} value={cc} onChange={e => setCc(e.target.value)}><option value="">Any</option><option value="u125">Under 125cc</option><option value="125">125 to 199cc</option><option value="200">200 to 349cc</option><option value="350">350cc and above</option></select></div>
        <div><label className="label" htmlFor="ml">Mileage</label><select id="ml" className={sel} value={mil} onChange={e => setMil(Number(e.target.value))}><option value={0}>Any</option><option value={30}>30+ kmpl</option><option value={40}>40+ kmpl</option><option value={50}>50+ kmpl</option></select></div>
        <div><label className="label" htmlFor="fu">Fuel type</label><select id="fu" className={sel} value={fuel} onChange={e => setFuel(e.target.value)}><option value="">Any</option><option>Petrol</option><option>Electric</option></select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="bp">Budget: up to {inr(maxP)}</label><input id="bp" type="range" min={60000} max={400000} step={10000} value={maxP} onChange={e => setMaxP(Number(e.target.value))} className="w-full accent-[#ff3d1f]" /></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 justify-between">
        <p className="text-white/70" aria-live="polite">{res.length} {res.length === 1 ? "bike" : "bikes"} found</p>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="so">Sort</label>
          <select id="so" className="input !py-2 !w-auto" value={sort} onChange={e => set("sort", e.target.value)}><option value="popular">Popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="new">Newest</option></select>
          <button className="p-3 border border-white/20 rounded-md" onClick={() => setList(!list)} aria-label={list ? "Grid view" : "List view"}>{list ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}</button>
        </div>
      </div>
      {chips.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{chips.map(([t, f]) => <button key={t} onClick={f} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">{t}<X className="h-3 w-3" /></button>)}<button onClick={clear} className="text-sm text-ember px-2">Clear all filters</button></div>}
      {res.length ? <div className={`mt-6 grid gap-5 ${list ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{res.map(b => <BikeCard key={b.id} bike={b} list={list} />)}</div>
        : <div className="mt-10 text-center py-16 border border-dashed border-white/20 rounded-lg"><p className="text-xl font-semibold">No bikes match these filters</p><p className="text-white/60 mt-1">Widen your budget or clear a filter.</p><button onClick={clear} className="btn btn-primary mt-5">Clear all filters</button></div>}
    </div>
  );
}
