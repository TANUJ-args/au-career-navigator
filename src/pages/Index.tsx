import { Link } from "react-router-dom";
import { BarChart3, Bot, Building2, ArrowRight } from "lucide-react";

const stats = [
  { value: "3,000+", label: "Alumni Records" },
  { value: "11", label: "Top Hiring Companies" },
  { value: "90+", label: "Startups at AHub" },
  { value: "₹131Cr", label: "NASSCOM CoE Ecosystem" },
];

const modules = [
  {
    icon: BarChart3,
    title: "Alumni Dashboard",
    desc: "See where AU students actually get placed. Filter by year, company, role, and skill level.",
  },
  {
    icon: Bot,
    title: "AI Career Chatbot",
    desc: "Tell the bot your profile. Get honest, data-backed career guidance instantly.",
  },
  {
    icon: Building2,
    title: "Campus Ecosystem",
    desc: "Discover AHub, NASSCOM CoE, Skill Development Centre and more — all in one place.",
  },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Navigate Your Future.
          </h1>
          <p className="mt-4 text-2xl md:text-3xl font-semibold text-mint">
            Powered by 100 Years of AU Legacy.
          </p>
          <p className="mt-6 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            One platform connecting AU students to placement intelligence, campus
            opportunities, and career guidance.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-mint text-navy font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition shadow-glow"
            >
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 bg-mint text-navy font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Talk to AI Bot <Bot className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-navy-soft border border-white/10 rounded-xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-mint">{s.value}</div>
              <div className="mt-2 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What is AU Career Compass */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">
            What is AU Career Compass?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Three connected modules that turn AU's 100-year legacy into your career edge.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div key={m.title} className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-mint/10 text-mint flex items-center justify-center mb-4">
                <m.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy">{m.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
