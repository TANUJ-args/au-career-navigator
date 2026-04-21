import { Link, NavLink, useLocation } from "react-router-dom";
import { Compass, Menu, MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/chatbot", label: "Chatbot" },
  { to: "/alumni", label: "Alumni" },
];

type Theme = "light" | "dark";

const Navbar = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const location = useLocation();

  const isLinkActive = (to: string, end?: boolean) => {
    if (end) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("au-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : prefersDark
          ? "dark"
          : "light";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("au-theme", theme);
  }, [theme]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#3a2a1a] bg-[#0d0d0d]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:px-6 lg:h-20">
        <Link to="/" className="min-w-0 flex items-center gap-2 text-gold transition-colors hover:text-gold-soft">
          <Compass className="h-5 w-5 shrink-0" />
          <span className="font-serif text-base font-bold tracking-tight sm:text-lg lg:text-xl">
            <span className="lg:hidden">AU@100 Navigator</span>
            <span className="hidden lg:inline">AU@100 Career Navigator</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ul className="hidden items-center gap-1 sm:gap-2 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gold text-[#0d0d0d] border border-gold"
                        : "text-white hover:text-white hover:bg-[#1f0f0f]"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8B6914] bg-[#1f0f0f] text-gold transition-colors hover:bg-[#2a1a1a] lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 border-[#3a2a1a] bg-[#0d0d0d]/95 p-1 text-white backdrop-blur-md lg:hidden"
            >
              {links.map((l) => {
                const active = isLinkActive(l.to, l.end);

                return (
                  <DropdownMenuItem key={l.to} asChild className="p-0 focus:bg-transparent">
                    <Link
                      to={l.to}
                      className={`w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-gold text-[#0d0d0d]"
                          : "text-white hover:bg-[#1f0f0f] hover:text-white"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 shrink-0 rounded-full border border-[#8B6914] bg-[#1f0f0f] text-gold hover:bg-[#2a1a1a] hover-gold-glow"
          >
            {theme === "dark" ? <SunMedium className="w-4 h-4 mx-auto" /> : <MoonStar className="w-4 h-4 mx-auto" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
