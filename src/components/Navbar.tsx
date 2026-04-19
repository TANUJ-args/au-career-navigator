import { NavLink, Link } from "react-router-dom";
import { Compass } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/chatbot", label: "Chatbot" },
  { to: "/ecosystem", label: "Ecosystem" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/95 backdrop-blur border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-mint font-bold text-lg tracking-tight">
          <Compass className="w-5 h-5" />
          AU Career Compass
        </Link>
        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-mint" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
