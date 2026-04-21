import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="relative min-h-screen flex flex-col overflow-x-hidden">
    <div className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute -top-32 -left-28 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute top-16 -right-24 h-96 w-96 rounded-full bg-maroon-light/20 blur-3xl" />
    </div>
    <Navbar />
    <main className="relative z-10 flex-1 pt-16 lg:pt-20">
      <Outlet />
    </main>
    <footer className="relative z-10 border-t border-[#8B6914]/60 bg-[#8B1A1A] text-white/85 text-sm py-6 text-center">
      AU Career Navigator · Built in collaboration with CPDC · Andhra University · AU@100
    </footer>
  </div>
);

export default Layout;
