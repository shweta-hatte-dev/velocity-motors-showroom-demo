import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { bikes, getBike, Bike } from "../data/bikes";
import { BikeVisual } from "../components/BikeVisual";
import { useStore } from "../lib/store";
import { inr, usePageMeta } from "../lib/utils";

export default function Compare() {
  usePageMeta("Compare Bikes", "Compare up to three bikes side by side.");
  const { compare, toggleCompare } = useStore();
  const sel = compare.map(getBike).filter(Boolean) as Bike[];
  const rows: [string, (b: Bike) => string, ((b: Bike) => number) | null, "min" | "max"][] = [
    ["Price (indicative)", b => inr(b.price), b => b.price, "min"], ["Engine", b => (b.cc ? `${b.cc} cc` : "Electric"), null, "max"],
    ["Mileage", b => (b.mileage ? `${b.mileage} kmpl` : "N/A"), b => b.mileage, "max"], ["Power", b => `${b.powerPs} PS`, b => b.powerPs, "max"],
    ["Torque", b => `${b.torqueNm} Nm`, b => b.torqueNm, "max"], ["Weight", b => `${b.weightKg} kg`, b => b.weightKg, "min"],
    ["Fuel type", b => b.fuel, null, "max"], ["Category", b => b.category, null, "max"], ["Key features", b => b.features.join(", "), null, "max"]
  ];
  const best = (f: (b: Bike) => number, m: "min" | "max") => { const v = sel.map(f); return m === "min" ? Math.min(...v) : Math.max(...v); };
  return (
    <div className="wrap py-10">
      <h1 className="h2">Compare bikes</h1>
      <div className="mt-5 max-w-sm"><label className="label" htmlFor="add">Add a bike ({sel.length}/3)</label>
        <select id="add" className="input" value="" disabled={sel.length >= 3} onChange={e => e.target.value && toggleCompare(e.target.value)}>
          <option value="">{sel.length >= 3 ? "Maximum of 3 reached" : "Choose a bike"}</option>{bikes.filter(b => !compare.includes(b.id)).map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}</select></div>
      {sel.length === 0 ? <div className="mt-10 border border-dashed border-white/20 rounded-lg py-16 text-center"><p className="text-xl font-semibold">Nothing to compare yet</p><p className="text-white/60 mt-1">Add two or three bikes to see them side by side.</p><Link to="/bikes" className="btn btn-primary mt-5">Explore bikes</Link></div> : (
        <div className="mt-8 overflow-x-auto border border-white/10 rounded-lg">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr><th className="sticky left-0 bg-ink-800 w-28 sm:w-40 p-3 text-left text-white/60 font-normal">Bike</th>{sel.map(b => (
              <th key={b.id} className="p-3 align-top text-left font-normal bg-ink-800 min-w-[170px]"><div className="flex justify-between"><Link to={`/bikes/${b.id}`} className="font-display text-xl font-extrabold uppercase">{b.model}</Link><button onClick={() => toggleCompare(b.id)} aria-label={`Remove ${b.model}`}><X className="h-4 w-4" /></button></div><p className="text-white/60">{b.brand}</p><BikeVisual bike={b} className="w-full mt-2" /></th>))}</tr></thead>
            <tbody>{rows.map(([label, get, num, m]) => {
              const diff = new Set(sel.map(get)).size > 1;
              return <tr key={label} className="border-t border-white/10"><th className="sticky left-0 bg-ink-900 p-3 text-left text-white/60 font-normal">{label}</th>{sel.map(b => {
                const win = num && sel.length > 1 && diff && num(b) === best(num, m);
                return <td key={b.id} className={`p-3 ${win ? "text-ember font-bold" : diff ? "text-white" : "text-white/70"}`}>{get(b)}{win && <span className="sr-only"> (best)</span>}</td>; })}</tr>; })}</tbody>
          </table>
        </div>
      )}
      {sel.length > 1 && <p className="mt-3 text-sm text-white/50">Orange values mark the best figure in a row (lowest price and weight, highest mileage, power and torque).</p>}
    </div>
  );
}
