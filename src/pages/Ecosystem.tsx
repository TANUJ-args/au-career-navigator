import { Link } from "react-router-dom";

type Card = {
  icon: string;
  tag: string;
  tagColor: "mint" | "gold" | "teal";
  stats: string;
  title: string;
  desc: string;
  href?: string;
  featured?: boolean;
};

const cards: Card[] = [
  {
    icon: "🚀",
    tag: "Startup Incubator",
    tagColor: "mint",
    title: "ā Hub",
    stats: "90+ Startups  •  ₹62.7Cr Funding  •  500+ Jobs",
    desc:
      "AU's official startup incubator. Get seed funding up to ₹10 lakhs through the NIDHI iTBI grant. Access mentorship, workspace, and investor connections.",
    href: "https://www.a-hub.co",
    featured: true,
  },
  {
    icon: "🔬",
    tag: "Govt Backed",
    tagColor: "gold",
    title: "NASSCOM CoE IoT & AI",
    stats: "₹131Cr Ecosystem  •  65 Seat Startup Area",
    desc:
      "Centre of Excellence on IoT and AI launched by MeitY and NASSCOM right here on AU campus. Open labs, industry projects, and deep-tech innovation.",
  },
  {
    icon: "🛠️",
    tag: "Industry Training",
    tagColor: "teal",
    title: "AU Skill Development Centre",
    stats: "Industry-grade Equipment & Software",
    desc:
      "Train on the same tools companies actually use. Bridges the gap between academics and real-world technical skills for engineering students.",
  },
  {
    icon: "💻",
    tag: "AU Alumni Founded",
    tagColor: "mint",
    title: "TheDigifac",
    stats: "Times of India Recognized",
    desc:
      "Low-code tech company founded by AU alumni. Recognized by Times of India for transforming Andhra University. A real success story from our campus.",
  },
  {
    icon: "💡",
    tag: "Innovation Initiative",
    tagColor: "teal",
    title: "AU Innovation Hub",
    stats: "Campus-wide Innovation",
    desc:
      "AU's broader innovation ecosystem supporting student ideas, research projects, and entrepreneurial thinking across all departments.",
  },
];

const tagClasses = {
  mint: "bg-maroon/15 text-maroon dark:bg-gold/20 dark:text-gold",
  gold: "bg-gold/15 text-maroon dark:bg-gold/25 dark:text-gold",
  teal: "bg-mint/15 text-mint",
} as const;

const EcoCard = ({ c }: { c: Card }) => (
  <div
    className={`glass rounded-2xl p-6 shadow-card border border-gold/20 flex flex-col hover-gold-glow ${
      c.featured ? "md:col-span-2 border-gold/40" : ""
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="text-4xl">{c.icon}</div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagClasses[c.tagColor]}`}>
        {c.tag}
      </span>
    </div>
    <h3 className="text-2xl text-maroon dark:text-ivory">{c.title}</h3>
    <div className="text-sm font-semibold text-gold mt-1">{c.stats}</div>
    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{c.desc}</p>
    <a
      href={c.href ?? "#"}
      target={c.href ? "_blank" : undefined}
      rel="noreferrer"
      className="mt-5 inline-flex justify-center bg-gold text-maroon font-semibold px-4 py-2 rounded-xl hover:bg-gold-soft transition"
    >
      Learn More
    </a>
  </div>
);

const Ecosystem = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-10">
        <p className="text-gold font-semibold uppercase tracking-[0.18em] text-xs md:text-sm">Campus Opportunities</p>
        <h1 className="text-3xl md:text-5xl text-maroon dark:text-ivory mt-2">AU's Innovation Ecosystem</h1>
        <p className="text-muted-foreground mt-2">
          Everything on campus you didn't know existed — in one place.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <EcoCard key={c.title} c={c} />
        ))}
      </div>

      {/* Path selector */}
      <section className="mt-16">
        <h2 className="text-2xl md:text-4xl text-maroon dark:text-ivory text-center">
          Which path is right for you?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl p-8 border border-gold/30 bg-maroon text-ivory shadow-card">
            <h3 className="text-3xl">Want a Job?</h3>
            <p className="mt-3 text-ivory/75">
              Use the Dashboard to find your target company, then talk to our AI bot for a personal roadmap.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex mt-6 bg-gold text-maroon font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-soft"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="rounded-2xl p-8 border border-gold/30 bg-charcoal text-ivory shadow-card">
            <h3 className="text-3xl">Have a Startup Idea?</h3>
            <p className="mt-3 text-ivory/75">
              AHub has already funded 90+ startups with ₹62.7Cr. Your idea could be next.
            </p>
            <a
              href="https://www.a-hub.co"
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-6 bg-gold text-maroon font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-soft"
            >
              Explore AHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ecosystem;
