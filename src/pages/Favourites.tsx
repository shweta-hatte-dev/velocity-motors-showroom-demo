import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getBike, Bike } from "../data/bikes";
import { BikeCard } from "../components/BikeCard";
import { BikeVisual } from "../components/BikeVisual";
import { useStore } from "../lib/store";
import { usePageMeta } from "../lib/utils";

export default function Favourites() {
  usePageMeta("Favourites", "Your saved bikes and colour choices.");
  const { favs, configs, removeConfig } = useStore();
  const list = favs.map(getBike).filter(Boolean) as Bike[];
  return (
    <div className="wrap py-10">
      <h1 className="h2">Favourites</h1>
      {list.length === 0 && configs.length === 0 ? <div className="mt-10 border border-dashed border-white/20 rounded-lg py-16 text-center"><p className="text-xl font-semibold">No favourites yet</p><p className="text-white/60 mt-1">Tap the heart on any bike to save it here.</p><Link to="/bikes" className="btn btn-primary mt-5">Explore Bikes</Link></div> : (<>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(b => <BikeCard key={b.id} bike={b} />)}</div>
        {configs.length > 0 && <section className="mt-14"><h2 className="font-display text-3xl font-extrabold uppercase mb-4">Saved colour choices</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{configs.map(c => { const b = getBike(c.id); return b ? (
            <div key={c.id + c.colour} className="rounded-lg border border-white/10 bg-ink-800 p-3"><BikeVisual bike={b} colour={c.colour} className="w-full" /><p className="font-semibold mt-2">{b.brand} {b.model}</p><p className="text-sm text-white/60">{c.colour}</p>
              <div className="flex gap-2 mt-2"><Link to={`/bikes/${b.id}`} className="btn btn-ghost !py-2 flex-1">Open</Link><button aria-label="Remove saved colour" onClick={() => removeConfig(c)} className="btn btn-ghost !py-2"><Trash2 className="h-4 w-4" /></button></div></div>) : null; })}</div></section>}
      </>)}
    </div>
  );
}
