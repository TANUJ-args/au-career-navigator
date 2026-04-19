import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-surface">
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <footer className="bg-navy text-white/60 text-sm py-6 text-center">
      AU Career Compass · Built for AU@100 Hackathon · Andhra University
    </footer>
  </div>
);

export default Layout;
