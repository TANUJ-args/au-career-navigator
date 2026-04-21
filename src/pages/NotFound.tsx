import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center glass rounded-3xl p-10 md:p-14 border border-[#3a2a1a] shadow-card max-w-xl w-full">
        <p className="text-gold uppercase tracking-[0.18em] text-xs md:text-sm font-semibold">Route Missing</p>
        <h1 className="mt-4 text-6xl md:text-7xl text-gold">404</h1>
        <p className="mb-6 mt-3 text-lg text-muted-foreground">This page is not part of the AU navigator map.</p>
        <a href="/" className="inline-flex bg-gold text-[#0d0d0d] px-5 py-2.5 rounded-xl font-semibold hover:bg-gold-soft">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
