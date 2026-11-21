import { Link } from "react-router-dom";
import { Heart, GitCompareArrows, CalendarCheck } from "lucide-react";
import { Bike } from "../data/bikes";
import { inr } from "../lib/utils";
import { useStore } from "../lib/store";
import { BikeVisual } from "./BikeVisual";

export function BikeCard({ bike, list = false }: { bike: Bike; list?: boolean }) {
  const { favs, toggleFav, compare, toggleCompare } = useStore();
  const fav = favs.includes(bike.id), cmp = compare.includes(bike.id);
  return (
    <article className={`group bg-ink-800 border border-white/10 rounded-lg overflow-hidden flex ${list ? "flex-col sm:flex-row" : "flex-col"} hover:border-white/30 transition`}>
      <Link to={`/bikes/${bike.id}`} className={`relative block bg-ink-700 ${list ? "sm:w-72 shrink-0" : ""}`} aria-label={`View ${bike.brand} ${bike.model}`}>
        <BikeVisual bike={bike} className="w-full aspect-[8/5] transition-transform duration-500 group-hover:scale-105" />
        {bike.badge && <span className="absolute top-3 left-3 bg-ember text-white text-xs font-bold px-2 py-1 rounded">{bike.badge}</span>}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-white/60">{bike.brand} · {bike.category}</p>
            <h3 className="font-display text-2xl font-extrabold uppercase leading-tight">{bike.model}</h3>
          </div>
          <button onClick={() => toggleFav(bike.id)} aria-pressed={fav} aria-label={fav ? "Remove from favourites" : "Save to favourites"} className="p-2 -m-2 rounded-full hover:bg-white/10">
            <Heart className={`h-5 w-5 ${fav ? "fill-ember text-ember" : "text-white/70"}`} />
          </button>
        </div>
        <p className="mt-2 text-xl font-bold">{inr(bike.price)} <span className="text-xs font-normal text-white/50">indicative ex-showroom</span></p>
        <p className="mt-1 text-sm text-white/70">{bike.cc ? `${bike.cc} cc` : "Electric"} · {bike.mileage ? `${bike.mileage} kmpl` : "Low running cost"}</p>
        <div className="mt-3 flex items-center gap-1.5" aria-label="Available colours">
          {bike.colors.map(x => <span key={x.name} title={x.name} className="h-4 w-4 rounded-full border border-white/30" style={{ background: x.hex }} />)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 mt-auto pt-4">
          <Link to={`/bikes/${bike.id}`} className="btn btn-ghost !py-2">View details</Link>
          <Link to={`/contact?bike=${bike.id}#test-ride`} className="btn btn-primary !py-2"><CalendarCheck className="h-4 w-4" />Book test ride</Link>
          <button onClick={() => toggleCompare(bike.id)} aria-pressed={cmp} className={`btn !py-2 col-span-2 ${cmp ? "bg-white text-ink-900" : "btn-ghost"}`}><GitCompareArrows className="h-4 w-4" />{cmp ? "Added to compare" : "Compare"}</button>
        </div>
      </div>
    </article>
  );
}
