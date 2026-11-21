import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocal } from "./utils";

interface Cfg { id: string; colour: string }
interface Ctx {
  favs: string[]; toggleFav: (id: string) => void;
  compare: string[]; toggleCompare: (id: string) => void; setCompare: (ids: string[]) => void;
  recent: string[]; addRecent: (id: string) => void;
  configs: Cfg[]; saveConfig: (c: Cfg) => void; removeConfig: (c: Cfg) => void;
  toast: (m: string) => void;
}
const S = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(S);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favs, setFavs] = useLocal<string[]>("vm:favs", []);
  const [compare, setCompare] = useLocal<string[]>("vm:compare", []);
  const [recent, setRecent] = useLocal<string[]>("vm:recent", []);
  const [configs, setConfigs] = useLocal<Cfg[]>("vm:configs", []);
  const [msgs, setMsgs] = useState<{ id: number; m: string }[]>([]);
  const toast = useCallback((m: string) => {
    const id = Date.now() + Math.random();
    setMsgs(x => [...x, { id, m }]);
    setTimeout(() => setMsgs(x => x.filter(y => y.id !== id)), 2600);
  }, []);
  const toggleFav = (id: string) => { const on = favs.includes(id); setFavs(on ? favs.filter(x => x !== id) : [...favs, id]); toast(on ? "Removed from favourites" : "Saved to favourites"); };
  const toggleCompare = (id: string) => {
    if (compare.includes(id)) { setCompare(compare.filter(x => x !== id)); toast("Removed from compare"); }
    else if (compare.length >= 3) toast("You can compare up to 3 bikes. Remove one first.");
    else { setCompare([...compare, id]); toast("Added to compare"); }
  };
  const addRecent = (id: string) => setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, 6));
  const saveConfig = (c: Cfg) => { if (!configs.some(x => x.id === c.id && x.colour === c.colour)) setConfigs([...configs, c]); toast("Configuration saved"); };
  const removeConfig = (c: Cfg) => setConfigs(configs.filter(x => !(x.id === c.id && x.colour === c.colour)));
  return (
    <S.Provider value={{ favs, toggleFav, compare, toggleCompare, setCompare, recent, addRecent, configs, saveConfig, removeConfig, toast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] space-y-2" role="status" aria-live="polite">
        <AnimatePresence>
          {msgs.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-md bg-white text-ink-900 text-sm font-semibold px-4 py-2 shadow-xl">{t.m}</motion.div>
          ))}
        </AnimatePresence>
      </div>
    </S.Provider>
  );
}
