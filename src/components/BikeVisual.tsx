import { useState } from "react";
import { Bike } from "../data/bikes";

// Generated illustration, used when a bike has no photo (or the photo fails to load). Never a broken image.
export function BikeVisual({ bike, colour, className = "" }: { bike: Bike; colour?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const col = bike.colors.find(x => x.name === colour) || bike.colors[0];
  const src = col.image || bike.image;
  if (src && !failed) return <img src={src} alt={`${bike.brand} ${bike.model}`} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
  const cr = bike.category === "Cruiser", sc = bike.category === "Scooter", adv = bike.category === "Adventure", sp = bike.category === "Sport";
  const wy = 178, wr = sc ? 38 : adv ? 56 : 50, x1 = cr ? 80 : 95, x2 = cr ? 320 : 305;
  const wheel = (cx: number) => (<g><circle cx={cx} cy={wy} r={wr} fill="#0c0d0f" stroke="#c9ced4" strokeWidth="7" /><circle cx={cx} cy={wy} r="9" fill="#9aa0a8" /></g>);
  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-label={`${bike.brand} ${bike.model} illustration in ${col.name}`}>
      <defs><radialGradient id={`g${bike.id}`} cx="50%" cy="100%" r="70%"><stop offset="0" stopColor={col.hex} stopOpacity=".35" /><stop offset="1" stopColor="#15171a" stopOpacity="0" /></radialGradient></defs>
      <rect width="400" height="250" fill={`url(#g${bike.id})`} />
      <ellipse cx="200" cy="232" rx="150" ry="8" fill="#000" opacity=".5" />
      {wheel(x1)}{wheel(x2)}
      {sc ? (
        <g>
          <path d="M70 175 Q70 125 125 118 L250 120 Q285 124 292 170 L292 178 L78 178 Z" fill={col.hex} />
          <path d="M255 120 L285 70 L305 74" stroke="#aeb3ba" strokeWidth="7" fill="none" strokeLinecap="round" />
          <rect x="110" y="104" width="105" height="16" rx="8" fill="#1b1d21" />
          <circle cx="292" cy="92" r="9" fill="#ffe9a8" />
        </g>
      ) : (
        <g>
          <path d={`M${x1} ${wy} L160 125 L250 118 L${x2} ${wy}`} stroke="#6f757d" strokeWidth="6" fill="none" />
          <path d={sp ? "M165 118 Q215 84 292 112 L270 134 L172 134 Z" : cr ? "M160 112 Q205 84 262 108 L255 130 L165 132 Z" : "M165 112 Q205 82 262 102 L254 128 L170 130 Z"} fill={col.hex} />
          <path d="M104 116 L165 108 L170 124 L100 130 Z" fill="#1b1d21" />
          <rect x="172" y="130" width="72" height="30" rx="4" fill="#2b2e33" />
          <path d="M128 164 L232 160" stroke="#9aa0a8" strokeWidth="8" strokeLinecap="round" />
          <path d={`M${x2} ${wy} L${adv ? 280 : 284} ${adv ? 76 : 96} L${adv ? 262 : 268} ${adv ? 68 : 86}`} stroke="#aeb3ba" strokeWidth="7" fill="none" strokeLinecap="round" />
          {sp && <path d="M255 100 L292 112 L284 76 Z" fill={col.hex} opacity=".9" />}
          <circle cx={adv ? 286 : 292} cy={adv ? 90 : 104} r="9" fill="#ffe9a8" />
        </g>
      )}
    </svg>
  );
}
