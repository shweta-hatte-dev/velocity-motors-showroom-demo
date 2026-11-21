import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calculator, CalendarCheck, GitCompareArrows, Heart, MessageCircle, Share2, Save } from "lucide-react";
import { bikes, getBike } from "../data/bikes";
import { BikeCard } from "../components/BikeCard";
import { BikeVisual } from "../components/BikeVisual";
import { useStore } from "../lib/store";
import { inr, usePageMeta, waLink } from "../lib/utils";

export default function Detail() {
  const { id } = useParams(); const bike = getBike(id);
  const { favs, toggleFav, compare, toggleCompare, addRecent, saveConfig, toast } = useStore();
  const [colour, setColour] = useState("");
  useEffect(() => { if (bike) { addRecent(bike.id); setColour(bike.colors[0].name); } }, [id]);
  usePageMeta(bike ? `${bike.brand} ${bike.model}` : "Bike not found", bike?.overview);
  if (!bike) return <div className="wrap py-24 text-center"><h1 className="h2">Bike not found</h1><Link to="/bikes" className="btn btn-primary mt-6">Explore bikes</Link></div>;
  const share = async () => {
    const data = { title: `${bike.brand} ${bike.model}`, url: location.href };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); toast("Link copied"); } } catch { /* cancelled */ }
  };
  const related = bikes.filter(b => b.id !== bike.id).sort((a, b) => (Number(b.category === bike.category) - Number(a.category === bike.category)) || Math.abs(a.price - bike.price) - Math.abs(b.price - bike.price)).slice(0, 3);
  const specs: [string, string][] = [["Engine", bike.cc ? `${bike.cc} cc` : "Electric motor"], ["Mileage", bike.mileage ? `${bike.mileage} kmpl (indicative)` : "Not applicable"], ["Transmission", bike.transmission], ["Fuel type", bike.fuel], ["Power", `${bike.powerPs} PS`], ["Torque", `${bike.torqueNm} Nm`], ["Kerb weight", `${bike.weightKg} kg`], ["Category", bike.category]];
  const fav = favs.includes(bike.id);
  return (
    <div className="wrap py-8 pb-28 lg:pb-8">
      <p className="text-sm text-white/50"><Link to="/bikes" className="hover:text-white">Explore bikes</Link> / {bike.brand} {bike.model}</p>
      <div className="mt-4 grid lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg bg-ink-800 border border-white/10 overflow-hidden"><BikeVisual bike={bike} colour={colour} className="w-full aspect-[8/5]" /></div>
          <p className="mt-2 text-sm text-white/60">Selected colour: <b className="text-white">{colour}</b>. Illustrative preview; the real bike colour may vary.</p>
          <div className="mt-3 flex flex-wrap gap-3">{bike.colors.map(c => <button key={c.name} onClick={() => setColour(c.name)} aria-pressed={colour === c.name} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${colour === c.name ? "border-ember bg-white/10" : "border-white/20"}`}><span className="h-4 w-4 rounded-full border border-white/30" style={{ background: c.hex }} />{c.name}</button>)}</div>
          <button className="btn btn-ghost mt-3" onClick={() => saveConfig({ id: bike.id, colour })}><Save className="h-4 w-4" />Save this colour</button>
        </div>
        <div>
          {bike.badge && <span className="bg-ember text-xs font-bold px-2 py-1 rounded">{bike.badge}</span>}
          <p className="mt-3 text-white/60">{bike.brand} · {bike.category}</p>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl leading-none">{bike.model}</h1>
          <p className="mt-4 text-3xl font-bold">{inr(bike.price)}</p>
          <p className="text-xs text-white/50">Indicative ex-showroom price on this demo. Ask the showroom for the current on-road price.</p>
          <p className="mt-5 text-white/75">{bike.overview}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link to={`/contact?bike=${bike.id}&colour=${encodeURIComponent(colour)}#test-ride`} className="btn btn-primary"><CalendarCheck className="h-4 w-4" />Book test ride</Link>
            <Link to={`/emi?bike=${bike.id}`} className="btn btn-ghost"><Calculator className="h-4 w-4" />Check EMI</Link>
            <a href={waLink("Bike availability", { bike, colour })} target="_blank" rel="noreferrer" className="btn bg-[#25d366] text-ink-900"><MessageCircle className="h-4 w-4" />WhatsApp enquiry</a>
            <button onClick={() => toggleCompare(bike.id)} className="btn btn-ghost"><GitCompareArrows className="h-4 w-4" />{compare.includes(bike.id) ? "Remove compare" : "Compare"}</button>
            <button onClick={() => toggleFav(bike.id)} className="btn btn-ghost"><Heart className={`h-4 w-4 ${fav ? "fill-ember text-ember" : ""}`} />{fav ? "Saved" : "Save favourite"}</button>
            <button onClick={share} className="btn btn-ghost"><Share2 className="h-4 w-4" />Share</button>
          </div>
        </div>
      </div>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section><h2 className="font-display text-3xl font-extrabold uppercase mb-3">Specifications</h2><dl className="divide-y divide-white/10 border-y border-white/10">{specs.map(([k, v]) => <div key={k} className="flex justify-between py-3 gap-4"><dt className="text-white/60">{k}</dt><dd className="font-semibold text-right">{v}</dd></div>)}</dl><p className="text-xs text-white/50 mt-2">Demo specifications. Edit them in src/data/bikes.ts and verify with the manufacturer.</p></section>
        <section><h2 className="font-display text-3xl font-extrabold uppercase mb-3">Key features</h2><ul className="space-y-2">{bike.features.map(f => <li key={f} className="flex gap-3 border-b border-white/10 pb-2"><span className="text-ember">✓</span>{f}</li>)}</ul></section>
      </div>
      <section className="mt-16"><h2 className="h2 mb-6">Similar bikes</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map(b => <BikeCard key={b.id} bike={b} />)}</div></section>
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-t border-white/10 p-3 pr-20 grid grid-cols-2 gap-2">
        <Link to={`/contact?bike=${bike.id}#test-ride`} className="btn btn-primary !py-2">Test ride</Link>
        <a href={waLink("General enquiry", { bike, colour })} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2">Enquire</a>
      </div>
    </div>
  );
}
