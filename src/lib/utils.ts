import { useEffect, useState } from "react";
import { showroom } from "../config/showroom";
import { Bike, Category, bikes } from "../data/bikes";

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const priceLabel = (b: Bike) => inr(b.price);

export function usePageMeta(title: string, desc?: string) {
  useEffect(() => {
    document.title = `${title} | ${showroom.name}`;
    if (desc) document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
  }, [title, desc]);
}

export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [key, v]);
  return [v, setV] as const;
}

// ---- WhatsApp ----
export type EnquiryType = "General enquiry" | "Test ride" | "EMI enquiry" | "Bike availability" | "Accessories enquiry" | "Exchange enquiry" | "Service enquiry";
export function waLink(type: EnquiryType, o: { bike?: Bike; colour?: string; message?: string; lines?: string[] } = {}) {
  const lines = [`Hello ${showroom.name}, I have a website enquiry.`, `Enquiry type: ${type}`];
  if (o.bike) {
    lines.push(`Bike: ${o.bike.brand} ${o.bike.model}`);
    if (o.colour) lines.push(`Colour: ${o.colour}`);
    lines.push(`Price shown on website: ${priceLabel(o.bike)} (indicative)`);
  }
  (o.lines || []).forEach(l => lines.push(l));
  if (o.message) lines.push(`Message: ${o.message}`);
  return `https://wa.me/${showroom.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// ---- EMI (reducing balance): P*r*(1+r)^n / ((1+r)^n - 1) ----
export function calcEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return { emi: 0, interest: 0, total: 0 };
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const total = emi * months;
  return { emi, interest: total - principal, total };
}

export const validMobile = (s: string) => /^[6-9]\d{9}$/.test(s.replace(/^\+?91/, "").replace(/[\s-]/g, ""));
export const today = () => new Date().toISOString().slice(0, 10);

// ---- Smart Bike Finder ----
export interface Answers { budget: number; use: string; priority: string; category: string }
export const budgetRanges = [[0, 80000, "Under ₹80,000"], [80000, 120000, "₹80,000 to ₹1.2 lakh"], [120000, 200000, "₹1.2 to ₹2 lakh"], [200000, 300000, "₹2 to ₹3 lakh"], [300000, 1e9, "Above ₹3 lakh"]] as const;
const useCats: Record<string, Category[]> = { "Daily commute": ["Commuter", "Scooter"], College: ["Street", "Commuter", "Scooter"], Touring: ["Adventure", "Cruiser"], "Sports riding": ["Sport", "Street"], "Family use": ["Commuter", "Scooter"] };
export function recommend(a: Answers) {
  const [lo, hi] = budgetRanges[a.budget];
  const out = bikes.map(b => {
    let s = 0; const why: string[] = [];
    if (b.price >= lo && b.price <= hi) { s += 40; why.push("fits your budget"); }
    else if (b.price < lo * 1.0 + 1 || b.price <= hi * 1.15) { s += b.price < lo ? 12 : 15; why.push("is close to your budget"); }
    if (useCats[a.use]?.includes(b.category)) { s += 25; why.push(`is suitable for ${a.use.toLowerCase()}`); }
    if (a.category !== "Any" && b.category === a.category) { s += 25; why.push(`is in your preferred ${a.category.toLowerCase()} category`); }
    if (a.priority === "Mileage" && b.mileage >= 45) { s += 10 + (b.mileage - 45) / 5; why.push("prioritises fuel efficiency"); }
    if (a.priority === "Performance" && b.powerPs >= 16) { s += 10 + b.powerPs / 10; why.push("delivers strong performance"); }
    if (a.priority === "Comfort" && ["Cruiser", "Adventure", "Scooter"].includes(b.category)) { s += 12; why.push("is built for comfortable riding"); }
    if (a.priority === "Style" && (b.badge || ["Sport", "Cruiser", "Street"].includes(b.category))) { s += 10; why.push("stands out for its styling"); }
    if (a.priority === "Low maintenance" && b.cc <= 160) { s += 12; why.push("keeps maintenance simple"); }
    return { bike: b, score: s, why };
  });
  return out.sort((x, y) => y.score - x.score).slice(0, 3);
}
