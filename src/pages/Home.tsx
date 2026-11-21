import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, Search, ShieldCheck, Wallet, Wrench, Headphones, Bike as BikeIcon, Eye } from "lucide-react";
import { showroom as s } from "../config/showroom";
import { bikes, categories, getBike } from "../data/bikes";
import { BikeCard } from "../components/BikeCard";
import { BikeVisual } from "../components/BikeVisual";
import { Faq } from "../components/Faq";
import { useStore } from "../lib/store";
import { usePageMeta } from "../lib/utils";

const Row = ({ title, items, to }: { title: string; items: typeof bikes; to?: string }) => (
  <section className="wrap mt-20">
    <div className="flex items-end justify-between mb-6"><h2 className="h2">{title}</h2>{to && <Link to={to} className="text-ember text-sm font-semibold">See all</Link>}</div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(b => <BikeCard key={b.id} bike={b} />)}</div>
  </section>
);

export default function Home() {
  usePageMeta("Motorcycles & Scooters in Pune", "Explore bikes, compare models, calculate EMI and book a test ride.");
  const [q, setQ] = useState(""); const nav = useNavigate(); const { recent } = useStore();
  const hero = getBike(s.hero.featuredBikeId) || bikes[0];
  const why = [[BikeIcon, "Test rides", "Ride before you decide. The showroom confirms your slot."], [Wallet, "Finance assistance", "Get help planning down payment and tenure."], [ShieldCheck, "Genuine accessories", "Ask for genuine gear and fittings."], [Headphones, "Customer support", "Reach the team on call or WhatsApp."], [Eye, "Transparent assistance", "Ask for the full on-road price before you decide."], [Wrench, "Service enquiries", "Send service questions straight from the contact page."]] as const;
  return (
    <>
      <section className="relative overflow-hidden min-h-[88vh] flex items-center bg-[radial-gradient(ellipse_at_70%_60%,#3a1209_0%,#0c0d0f_60%)]">
        <motion.div aria-hidden className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-ember/20 blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="wrap relative grid lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="font-display font-black uppercase text-6xl sm:text-8xl leading-[.9]">{s.hero.line1}<br /><span className="text-ember">{s.hero.line2}</span></motion.h1>
            <p className="mt-6 max-w-md text-lg text-white/70">{s.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/bikes" className="btn btn-primary">Explore Bikes</Link><Link to="/finder" className="btn btn-ghost">Find My Perfect Bike</Link></div>
          </div>
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .15 }}>
            <Link to={`/bikes/${hero.id}`} aria-label={`View ${hero.model}`}><BikeVisual bike={hero} className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]" /></Link>
            <p className="text-center text-sm text-white/60">{hero.brand} {hero.model} · {hero.cc} cc</p>
          </motion.div>
        </div>
        <a href="#find" aria-label="Scroll down" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60"><ArrowDown className="h-6 w-6 animate-bounce" /></a>
      </section>

      <section id="find" className="wrap mt-16">
        <h2 className="h2">Find the bike that fits your life.</h2>
        <form className="mt-5 flex gap-2 max-w-2xl" onSubmit={e => { e.preventDefault(); nav(`/bikes?q=${encodeURIComponent(q)}`); }}>
          <input className="input" aria-label="Search bikes" placeholder="Search by bike name, brand or category" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn btn-primary" aria-label="Search"><Search className="h-5 w-5" /></button>
        </form>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(c => <Link key={c} to={`/bikes?cat=${c}`} className="rounded-lg border border-white/10 bg-ink-800 p-5 hover:border-ember transition"><p className="font-display text-2xl font-extrabold uppercase">{c}</p><p className="text-xs text-white/50">{bikes.filter(b => b.category === c).length} models</p></Link>)}
        </div>
      </section>

      <Row title="Featured bikes" items={bikes.filter(b => b.popular).slice(0, 3)} to="/bikes" />
      <Row title="New arrivals" items={bikes.filter(b => b.badge === "NEW" || b.year >= 2025).slice(0, 3)} to="/bikes?sort=new" />
      <Row title="Trending now" items={bikes.filter(b => b.badge === "POPULAR" || b.badge === "BEST VALUE").slice(0, 3)} to="/bikes?sort=popular" />
      {recent.length > 0 && <Row title="Recently viewed" items={recent.map(getBike).filter(Boolean).slice(0, 3) as typeof bikes} />}

      <section className="wrap mt-20">
        <div className="flex items-end justify-between mb-6"><h2 className="h2">Offers</h2><Link to="/offers" className="text-ember text-sm font-semibold">All offers</Link></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{s.offers.map(o => <Link to="/offers" key={o.id} className="rounded-lg bg-gradient-to-br from-ink-700 to-ink-800 border border-white/10 p-5 hover:border-ember"><p className="text-ember text-sm font-semibold">{o.type}</p><h3 className="mt-1 font-semibold text-lg">{o.title}</h3><p className="mt-2 text-sm text-white/60">{o.text}</p></Link>)}</div>
        <p className="mt-3 text-xs text-white/50">{s.offerNote}</p>
      </section>

      <section className="wrap mt-20"><h2 className="h2">Why ride with us</h2>
        <div className="mt-6 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3 border border-white/10 rounded-lg overflow-hidden">
          {why.map(([I, t, d]) => <div key={t} className="bg-ink-900 p-6"><I className="h-6 w-6 text-ember" /><h3 className="mt-3 font-semibold">{t}</h3><p className="text-sm text-white/60 mt-1">{d}</p></div>)}
        </div></section>

      <section className="wrap mt-20"><h2 className="h2">What riders say</h2>
        <p className="text-sm text-white/50 mt-1">Sample testimonials for demonstration. Replace with real customer reviews before going live.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{["The team helped me compare two bikes and explained the EMI clearly.", "Booking a test ride through WhatsApp took less than a minute.", "I found the accessories I needed without visiting twice."].map((t, i) => <figure key={i} className="rounded-lg bg-ink-800 border border-white/10 p-5"><blockquote className="text-white/80">“{t}”</blockquote><figcaption className="mt-3 text-sm text-white/50">Sample customer {i + 1} (demo)</figcaption></figure>)}</div></section>

      <section className="wrap mt-20 max-w-3xl"><h2 className="h2 mb-6">Questions riders ask</h2><Faq /></section>
    </>
  );
}
