import { FormEvent, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { showroom as s } from "../config/showroom";
import { bikes, getBike } from "../data/bikes";
import { Faq } from "../components/Faq";
import { today, usePageMeta, validMobile, waLink } from "../lib/utils";

export default function Contact() {
  usePageMeta("Showroom & Contact", "Visit the showroom, book a test ride or send a service enquiry.");
  const [sp] = useSearchParams(); const pre = getBike(sp.get("bike") || undefined);
  const [f, setF] = useState({ name: "", phone: "", bike: pre?.id || "", date: "", time: "11:00", city: "Pune", msg: "" });
  const [err, setErr] = useState<Record<string, string>>({}); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false);
  const bike = getBike(f.bike); const colour = sp.get("colour") || undefined;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Enter your full name."; if (!validMobile(f.phone)) x.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!f.bike) x.bike = "Choose a bike."; if (!f.date) x.date = "Choose a preferred date."; else if (f.date < today()) x.date = "The date cannot be in the past.";
    if (!f.city.trim()) x.city = "Enter your city or area."; setErr(x);
    if (!Object.keys(x).length) { setLoading(true); setTimeout(() => { setLoading(false); setDone(true); }, 500); }
  };
  const summary = [`Name: ${f.name}`, `Mobile: ${f.phone}`, `Preferred date: ${f.date}`, `Preferred time: ${f.time}`, `City: ${f.city}`];
  const E = ({ k }: { k: string }) => (err[k] ? <p className="text-sm text-ember mt-1" role="alert">{err[k]}</p> : null);
  return (
    <div className="wrap py-10">
      <h1 className="h2">Showroom and contact</h1>
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="font-semibold text-xl">{s.name}</p>
          <p className="flex gap-3 text-white/75"><MapPin className="h-5 w-5 shrink-0" />{s.address}</p><p className="flex gap-3 text-white/75"><Phone className="h-5 w-5" /><a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></p>
          <div className="flex gap-3 text-white/75"><Clock className="h-5 w-5 shrink-0" /><div>{s.hours.map(([d, t]) => <p key={d}>{d}: {t}</p>)}</div></div>
          <div className="flex flex-wrap gap-3"><a className="btn btn-ghost" href={s.mapsUrl} target="_blank" rel="noreferrer">Get directions</a><a className="btn bg-[#25d366] text-ink-900" href={waLink("General enquiry")} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a></div>
          <p className="text-xs text-white/50">Demo details. Replace the address, phone and map in src/config/showroom.ts.</p>
          <iframe title="Showroom location map" src={s.mapEmbed} loading="lazy" className="w-full h-72 rounded-lg border border-white/10" />
        </div>
        <section id="test-ride" className="scroll-mt-24 rounded-lg bg-ink-800 border border-white/10 p-6">
          <h2 className="font-display text-4xl font-extrabold uppercase">Book a test ride</h2>
          {done ? (
            <div className="mt-4" role="status"><p className="text-xl font-semibold text-ember">Your test ride request is ready to send.</p>
              <p className="text-white/70 mt-1">It is not confirmed yet. Send it on WhatsApp and the showroom will confirm availability.</p>
              <dl className="mt-4 text-sm divide-y divide-white/10 border-y border-white/10"><div className="py-2 flex justify-between"><dt className="text-white/60">Bike</dt><dd>{bike?.brand} {bike?.model}</dd></div>{summary.map(l => { const [k, ...v] = l.split(": "); return <div key={k} className="py-2 flex justify-between"><dt className="text-white/60">{k}</dt><dd>{v.join(": ")}</dd></div>; })}</dl>
              <a className="btn btn-primary w-full mt-4" target="_blank" rel="noreferrer" href={waLink("Test ride", { bike, colour, message: f.msg, lines: summary })}>Send request on WhatsApp</a>
              <button className="btn btn-ghost w-full mt-2" onClick={() => setDone(false)}>Edit details</button></div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="n">Full name</label><input id="n" className="input" value={f.name} onChange={set("name")} autoComplete="name" /><E k="name" /></div>
              <div><label className="label" htmlFor="ph">Mobile number</label><input id="ph" inputMode="tel" className="input" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="98765 43210" /><E k="phone" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="bk">Bike</label><select id="bk" className="input" value={f.bike} onChange={set("bike")}><option value="">Choose a bike</option>{bikes.map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}</select><E k="bike" /></div>
              <div><label className="label" htmlFor="dt">Preferred date</label><input id="dt" type="date" min={today()} className="input" value={f.date} onChange={set("date")} /><E k="date" /></div>
              <div><label className="label" htmlFor="tm">Preferred time</label><select id="tm" className="input" value={f.time} onChange={set("time")}>{["10:00", "11:00", "12:00", "14:00", "16:00", "18:00"].map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="ct">City or area</label><input id="ct" className="input" value={f.city} onChange={set("city")} /><E k="city" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="ms">Message (optional)</label><textarea id="ms" rows={3} className="input" value={f.msg} onChange={set("msg")} /></div>
              <button className="btn btn-primary sm:col-span-2" disabled={loading}>{loading ? "Preparing…" : "Prepare test ride request"}</button>
            </form>)}
        </section>
      </div>
      <section className="mt-14 max-w-2xl"><h2 className="font-display text-3xl font-extrabold uppercase mb-2">Service enquiry</h2><p className="text-white/65">Need a service or repair? Tell the team on WhatsApp.</p>
        <a className="btn btn-ghost mt-3" target="_blank" rel="noreferrer" href={waLink("Service enquiry", { message: "I would like to enquire about servicing." })}>Send service enquiry</a></section>
      <section className="mt-14 max-w-3xl"><h2 className="h2 mb-6">FAQ</h2><Faq /></section>
      <section className="mt-14 grid gap-6 md:grid-cols-2 text-sm text-white/65">
        <div id="privacy" className="scroll-mt-24"><h2 className="font-semibold text-white text-lg">Privacy policy</h2><p className="mt-1">This demo stores favourites and comparison choices only in your own browser. Forms are not sent to a server; they open WhatsApp with your message. Replace this text with the showroom's real policy.</p></div>
        <div id="terms" className="scroll-mt-24"><h2 className="font-semibold text-white text-lg">Terms</h2><p className="mt-1">Prices, offers and specifications are indicative and may change. Availability and final prices are confirmed by the showroom. <Link to="/bikes" className="underline">Browse bikes</Link>.</p></div>
      </section>
    </div>
  );
}
