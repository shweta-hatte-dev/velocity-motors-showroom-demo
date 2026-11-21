import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { showroom as s } from "../config/showroom";
import { bikes } from "../data/bikes";
import { BikeCard } from "../components/BikeCard";
import { usePageMeta, validMobile, waLink } from "../lib/utils";

export default function Offers() {
  usePageMeta("Offers & Exchange", "Exchange, finance and seasonal offers. Illustrative and subject to dealership verification.");
  const [f, setF] = useState({ brand: "", model: "", year: "", condition: "Good", phone: "" });
  const [err, setErr] = useState<Record<string, string>>({}); const [link, setLink] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (!f.brand.trim()) x.brand = "Enter your current vehicle brand."; if (!f.model.trim()) x.model = "Enter the model.";
    if (!/^(19|20)\d{2}$/.test(f.year) || +f.year > new Date().getFullYear()) x.year = "Enter a valid year, like 2019.";
    if (!validMobile(f.phone)) x.phone = "Enter a valid 10-digit Indian mobile number."; setErr(x);
    if (!Object.keys(x).length) setLink(waLink("Exchange enquiry", { lines: [`Current vehicle: ${f.brand} ${f.model} (${f.year})`, `Condition: ${f.condition}`, `Contact: ${f.phone}`] }));
  };
  const field = (k: keyof typeof f, label: string, ph = "") => (<div><label className="label" htmlFor={k}>{label}</label><input id={k} className="input" placeholder={ph} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />{err[k] && <p className="text-sm text-ember mt-1">{err[k]}</p>}</div>);
  return (
    <div className="wrap py-10">
      <h1 className="h2">Offers and exchange</h1><p className="text-white/60 mt-2">{s.offerNote}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{s.offers.map(o => (
        <div key={o.id} className="rounded-lg bg-gradient-to-br from-ink-700 to-ink-800 border border-white/10 p-6"><p className="text-ember text-sm font-semibold">{o.type}</p><h2 className="text-xl font-semibold mt-1">{o.title}</h2><p className="text-white/65 mt-2">{o.text}</p>
          {o.cta === "exchange" ? <a href="#exchange" className="btn btn-ghost mt-4">Start exchange enquiry</a> : o.cta === "emi" ? <Link to="/emi" className="btn btn-ghost mt-4">Open EMI calculator</Link> : o.cta === "accessories" ? <Link to="/accessories" className="btn btn-ghost mt-4">View accessories</Link> : <a className="btn btn-ghost mt-4" target="_blank" rel="noreferrer" href={waLink("General enquiry", { message: `Please share details of: ${o.title}` })}>Ask on WhatsApp</a>}</div>))}</div>
      <section id="exchange" className="mt-16 max-w-2xl scroll-mt-24"><h2 className="font-display text-4xl font-extrabold uppercase">Exchange enquiry</h2>
        <p className="text-white/60 mt-1">The showroom evaluates your vehicle after inspection. No exchange value is promised online.</p>
        {link ? <div className="mt-5 rounded-lg border border-white/10 bg-ink-800 p-6"><p className="font-semibold text-lg">Your enquiry is ready.</p><p className="text-white/65 mt-1">Send it on WhatsApp so the showroom can respond.</p><a className="btn btn-primary mt-4" href={link} target="_blank" rel="noreferrer">Send on WhatsApp</a></div> : (
          <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">{field("brand", "Current vehicle brand", "Honda")}{field("model", "Model", "Shine")}{field("year", "Year", "2019")}
            <div><label className="label" htmlFor="cond">Approximate condition</label><select id="cond" className="input" value={f.condition} onChange={e => setF({ ...f, condition: e.target.value })}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs repair</option></select></div>
            <div className="sm:col-span-2">{field("phone", "Your mobile number", "98765 43210")}</div><button className="btn btn-primary sm:col-span-2">Prepare WhatsApp enquiry</button></form>)}
      </section>
      <section className="mt-16"><h2 className="h2 mb-6">Featured models</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{bikes.filter(b => b.badge).slice(0, 3).map(b => <BikeCard key={b.id} bike={b} />)}</div></section>
    </div>
  );
}
