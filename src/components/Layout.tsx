import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, MessageCircle, Search, X, Instagram, Facebook, Youtube, MapPin, Phone } from "lucide-react";
import { showroom as s } from "../config/showroom";
import { bikes, categories } from "../data/bikes";
import { useStore } from "../lib/store";
import { inr, waLink } from "../lib/utils";

const links: [string, string][] = [["/", "Home"], ["/bikes", "Explore Bikes"], ["/compare", "Compare"], ["/offers", "Offers"], ["/accessories", "Accessories"], ["/contact", "About & Contact"]];

function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState(""); const nav = useNavigate();
  const res = q.trim() ? bikes.filter(b => `${b.brand} ${b.model} ${b.category} ${b.cc}cc`.toLowerCase().includes(q.toLowerCase())).slice(0, 5) : [];
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 p-4 pt-20" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search bikes">
      <div className="mx-auto max-w-xl bg-ink-800 rounded-lg p-4 border border-white/10" onClick={e => e.stopPropagation()}>
        <form onSubmit={e => { e.preventDefault(); nav(`/bikes?q=${encodeURIComponent(q)}`); onClose(); }}>
          <input autoFocus className="input" placeholder="Search by bike, brand, category or cc" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
        </form>
        <ul className="mt-3 space-y-1">
          {res.map(b => <li key={b.id}><Link onClick={onClose} to={`/bikes/${b.id}`} className="flex justify-between rounded p-3 hover:bg-white/10"><span>{b.brand} {b.model}</span><span className="text-white/60">{inr(b.price)}</span></Link></li>)}
          {q.trim() && !res.length && <li className="p-3 text-white/60">No bikes match "{q}". Try a brand or category.</li>}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Layout() {
  const { favs, compare } = useStore(); const loc = useLocation();
  const [open, setOpen] = useState(false), [search, setSearch] = useState(false);
  useEffect(() => { setOpen(false); if (!loc.hash) window.scrollTo(0, 0); else setTimeout(() => document.querySelector(loc.hash)?.scrollIntoView(), 50); }, [loc.pathname, loc.hash]);
  const cls = ({ isActive }: { isActive: boolean }) => `px-3 py-2 text-sm rounded hover:text-white ${isActive ? "text-white" : "text-white/65"}`;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] bg-white text-ink-900 p-2 rounded">Skip to content</a>
      <header className="sticky top-0 z-50 bg-ink-900/90 backdrop-blur border-b border-white/10">
        <div className="wrap flex h-16 items-center justify-between gap-3">
          <Link to="/" className="font-display text-2xl font-black tracking-wider" aria-label={`${s.name} home`}><span className="text-ember">▰</span> {s.logoText}</Link>
          <nav className="hidden lg:flex" aria-label="Main">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === "/"} className={cls}>{l}</NavLink>)}</nav>
          <div className="flex items-center gap-1">
            <button className="p-3 hover:bg-white/10 rounded-full" onClick={() => setSearch(true)} aria-label="Search"><Search className="h-5 w-5" /></button>
            <Link to="/favourites" className="relative p-3 hover:bg-white/10 rounded-full" aria-label={`Favourites (${favs.length})`}><Heart className="h-5 w-5" />{favs.length > 0 && <span className="absolute top-1 right-1 bg-ember text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center">{favs.length}</span>}</Link>
            <button className="lg:hidden p-3 hover:bg-white/10 rounded-full" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        <AnimatePresence>{open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-white/10 bg-ink-900" aria-label="Mobile">
            <div className="wrap py-2 flex flex-col">{links.concat([["/finder", "Find My Perfect Bike"], ["/emi", "EMI Calculator"]]).map(([to, l]) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `py-3 text-lg ${isActive ? "text-ember" : ""}`}>{l}</NavLink>)}</div>
          </motion.nav>
        )}</AnimatePresence>
      </header>
      <AnimatePresence>{search && <SearchModal onClose={() => setSearch(false)} />}</AnimatePresence>
      <main id="main"><Outlet /></main>
      {compare.length > 0 && !loc.pathname.startsWith("/compare") && (
        <Link to="/compare" className="fixed bottom-24 left-4 z-40 btn bg-white text-ink-900 shadow-xl">Compare ({compare.length}/3)</Link>
      )}
      <a href={waLink("General enquiry")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-4 z-40 h-14 w-14 rounded-full bg-[#25d366] text-white grid place-items-center shadow-xl hover:scale-105 transition"><MessageCircle className="h-7 w-7" /></a>
      <footer className="mt-24 border-t border-white/10 bg-ink-800">
        <div className="wrap py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="font-display text-3xl font-black tracking-wider"><span className="text-ember">▰</span> {s.logoText}</p><p className="mt-3 text-white/60 text-sm">{s.tagline}</p>
            <div className="mt-4 flex gap-3">{[[Instagram, s.social.instagram, "Instagram"], [Facebook, s.social.facebook, "Facebook"], [Youtube, s.social.youtube, "YouTube"]].map(([I, h, n]) => { const Icon = I as typeof Instagram; return <a key={n as string} href={h as string} target="_blank" rel="noreferrer" aria-label={n as string} className="p-2 border border-white/20 rounded-full hover:bg-white/10"><Icon className="h-4 w-4" /></a>; })}</div></div>
          <div><h3 className="font-semibold mb-3">Quick links</h3><ul className="space-y-2 text-sm text-white/65">{links.map(([to, l]) => <li key={to}><Link to={to} className="hover:text-white">{l}</Link></li>)}<li><Link to="/finder" className="hover:text-white">Find My Perfect Bike</Link></li><li><Link to="/emi" className="hover:text-white">EMI Calculator</Link></li></ul></div>
          <div><h3 className="font-semibold mb-3">Bike categories</h3><ul className="space-y-2 text-sm text-white/65">{categories.map(c => <li key={c}><Link to={`/bikes?cat=${c}`} className="hover:text-white">{c}</Link></li>)}</ul></div>
          <div className="text-sm text-white/65 space-y-2"><h3 className="font-semibold text-white mb-3">Contact</h3>
            <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" />{s.address}</p>
            <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5" />{s.phone}</p>
            <a className="inline-block text-ember" href={waLink("General enquiry")} target="_blank" rel="noreferrer">WhatsApp us</a></div>
        </div>
        <div className="border-t border-white/10 py-5 text-xs text-white/50"><div className="wrap flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} {s.name}. Demo website: contact details, prices and specifications are sample values.</p>
          <p className="flex gap-4"><Link to="/contact#privacy">Privacy policy</Link><Link to="/contact#terms">Terms</Link></p></div></div>
      </footer>
      {s.showDemoBadge && <span className="fixed bottom-1 left-1 z-30 text-[10px] text-white/40 pointer-events-none">Demo experience</span>}
    </>
  );
}
