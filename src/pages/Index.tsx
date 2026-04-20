import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, Building2, Sparkles } from "lucide-react";
import FamousAlumniSection from "@/components/FamousAlumniSection";

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
      <section className="relative overflow-hidden bg-hero text-ivory">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <p className="uppercase tracking-[0.24em] text-gold font-semibold text-xs md:text-sm reveal-up">
            AU@100 Hackathon Project
          </p>
          <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl text-ivory reveal-up" style={{ animationDelay: "120ms" }}>
            Navigate Your Future
          </h1>
          <p className="mt-4 text-xl md:text-3xl font-semibold text-gold reveal-up" style={{ animationDelay: "240ms" }}>
            Powered by a Century of Andhra University Legacy
          </p>
          <p className="mt-6 text-base md:text-lg text-ivory/75 max-w-3xl mx-auto reveal-up" style={{ animationDelay: "340ms" }}>
            A premium, unified career platform connecting AU students to verified placement trends,
            AI-guided planning, and high-impact innovation opportunities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 reveal-up" style={{ animationDelay: "420ms" }}>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-gold text-maroon font-semibold px-6 py-3 rounded-xl hover:bg-gold-soft hover-gold-glow"
            >
              Explore Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 glass text-ivory font-semibold px-6 py-3 rounded-xl hover:border-gold/70"
            >
              Talk to AI Mentor <Bot className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {stats.map((s, index) => (
            <div
              key={s.label}
              className="glass-dark rounded-2xl p-6 text-center reveal-up"
              style={{ animationDelay: `${500 + index * 80}ms` }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-gold">{s.value}</div>
              <div className="mt-2 text-sm text-ivory/75">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-gold font-semibold uppercase tracking-[0.2em] text-xs md:text-sm">Platform Modules</p>
          <h2 className="text-3xl md:text-5xl text-maroon dark:text-ivory mt-3">
            Built for Outcomes, Not Guesswork
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Three connected modules that turn AU's 100-year heritage into your practical career advantage.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((m, index) => (
            <article
              key={m.title}
              className="glass rounded-2xl p-7 shadow-card hover-gold-glow reveal-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-maroon/10 dark:bg-gold/20 text-maroon dark:text-gold flex items-center justify-center mb-5">
                <m.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl text-maroon dark:text-ivory">{m.title}</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <FamousAlumniSection />

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-maroon text-ivory p-10 md:p-14 shadow-card border border-gold/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.18em] text-gold text-xs md:text-sm font-semibold">Start Strong</p>
              <h2 className="text-3xl md:text-5xl mt-3">Make the Next 100 Years Yours</h2>
              <p className="mt-4 text-ivory/75 max-w-2xl">
                Your AU journey can lead to global roles, startups, and leadership. Start by exploring
                verified alumni outcomes and map your next step today.
              </p>
            </div>
            <Link
              to="/ecosystem"
              className="inline-flex items-center justify-center gap-2 bg-gold text-maroon font-semibold px-7 py-3 rounded-xl hover:bg-gold-soft hover-gold-glow"
            >
              Discover Ecosystem <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
