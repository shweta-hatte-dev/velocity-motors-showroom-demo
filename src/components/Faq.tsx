import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
const faqs = [
  ["How do I book a test ride?", "Fill in the test ride form and send it on WhatsApp. The showroom will confirm availability and timing with you. Nothing is booked until they confirm."],
  ["Can I get finance?", "Finance assistance is available through the showroom's partners. Use the EMI calculator for an estimate, then enquire. Rates and eligibility depend on the finance provider."],
  ["Which documents are needed to buy a bike?", "Usually ID proof, address proof and photographs. Finance may need income documents. Ask the showroom for the exact list."],
  ["Can I exchange my old vehicle?", "Yes, you can enquire. The showroom evaluates your vehicle after inspection, so no exchange value is promised online."],
  ["How do I book a bike?", "Choose your model and colour, then enquire on WhatsApp. The showroom shares availability, on-road price and booking steps."],
  ["What about warranty?", "Warranty terms depend on the manufacturer and model. Ask the showroom for the policy for the bike you choose."]
];
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {faqs.map(([q, a], i) => (
        <div key={q}>
          <button className="w-full flex justify-between items-center gap-4 py-4 text-left font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}<ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? "rotate-180" : ""}`} /></button>
          <AnimatePresence initial={false}>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-white/70 pb-4">{a}</motion.p>}</AnimatePresence>
        </div>
      ))}
    </div>
  );
}
