import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { bikes, getBike } from "../data/bikes";
import { calcEmi, inr, usePageMeta, waLink } from "../lib/utils";

export default function Emi() {
  usePageMeta("EMI Calculator", "Estimate your monthly bike loan EMI.");
  const [sp] = useSearchParams(); const pre = getBike(sp.get("bike") || undefined);
  const [bikeId, setBikeId] = useState(pre?.id || "");
  const [price, setPrice] = useState(pre?.price || 120000), [down, setDown] = useState(Math.round((pre?.price || 120000) * 0.2)), [rate, setRate] = useState(10), [months, setMonths] = useState(36);
  const loan = Math.max(price - down, 0); const r = calcEmi(loan, rate, months); const bike = getBike(bikeId);
  const choose = (id: string) => { setBikeId(id); const b = getBike(id); if (b) { setPrice(b.price); setDown(Math.round(b.price * 0.2)); } };
  const num = (f: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => f(Math.max(0, Number(e.target.value) || 0));
  return (
    <div className="wrap py-12 max-w-4xl">
      <h1 className="h2">EMI calculator</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div><label className="label" htmlFor="b">Choose a bike (optional)</label><select id="b" className="input" value={bikeId} onChange={e => choose(e.target.value)}><option value="">Enter price manually</option>{bikes.map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}</select></div>
          <div><label className="label" htmlFor="p">Vehicle price (₹)</label><input id="p" type="number" className="input" value={price} onChange={num(setPrice)} /></div>
          <div><label className="label" htmlFor="d">Down payment (₹)</label><input id="d" type="number" className="input" value={down} onChange={num(setDown)} />{down > price && <p className="text-sm text-ember mt-1">Down payment cannot exceed the price.</p>}</div>
          <div><label className="label">Loan amount</label><p className="input !bg-ink-700">{inr(loan)}</p></div>
          <div><label className="label" htmlFor="r">Interest rate: {rate}% per year</label><input id="r" type="range" min={5} max={25} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-[#ff3d1f]" /></div>
          <div><label className="label" htmlFor="m">Tenure: {months} months</label><input id="m" type="range" min={6} max={60} step={6} value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full accent-[#ff3d1f]" /></div>
        </div>
        <div className="rounded-lg bg-ink-800 border border-white/10 p-6 h-fit" aria-live="polite">
          <p className="text-white/60">Monthly EMI</p><p className="font-display text-6xl font-black text-ember">{inr(r.emi)}</p>
          <dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-white/60">Loan amount</dt><dd>{inr(loan)}</dd></div><div className="flex justify-between"><dt className="text-white/60">Total interest</dt><dd>{inr(r.interest)}</dd></div><div className="flex justify-between font-bold border-t border-white/10 pt-2"><dt>Total amount payable</dt><dd>{inr(r.total)}</dd></div></dl>
          <p className="mt-4 text-xs text-white/50">EMI is an estimate. Actual rates and loan eligibility depend on the finance provider.</p>
          <a className="btn btn-primary w-full mt-5" target="_blank" rel="noreferrer" href={waLink("EMI enquiry", { bike, lines: [`Vehicle price: ${inr(price)}`, `Down payment: ${inr(down)}`, `Tenure: ${months} months at ${rate}% (estimated EMI ${inr(r.emi)})`] })}>Enquire About Finance</a>
          <Link to="/bikes" className="block text-center text-sm text-white/60 mt-3 underline">Browse bikes</Link>
        </div>
      </div>
    </div>
  );
}
