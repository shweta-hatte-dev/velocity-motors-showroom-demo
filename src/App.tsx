import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Detail from "./pages/Detail";
import Finder from "./pages/Finder";
import Compare from "./pages/Compare";
import Emi from "./pages/Emi";
import Accessories from "./pages/Accessories";
import Offers from "./pages/Offers";
import Favourites from "./pages/Favourites";
import Contact from "./pages/Contact";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bikes" element={<Inventory />} />
        <Route path="bikes/:id" element={<Detail />} />
        <Route path="finder" element={<Finder />} />
        <Route path="compare" element={<Compare />} />
        <Route path="emi" element={<Emi />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="offers" element={<Offers />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
