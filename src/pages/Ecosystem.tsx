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
  mint: "bg-mint/15 text-mint",
  gold: "bg-gold/15 text-gold",
  teal: "bg-teal/15 text-teal",
} as const;

const EcoCard = ({ c }: { c: Card }) => (
  <div
    className={`bg-card rounded-xl p-6 shadow-card border border-border flex flex-col ${
      c.featured ? "md:col-span-2 border-mint/40" : ""
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="text-4xl">{c.icon}</div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagClasses[c.tagColor]}`}>
        {c.tag}
      </span>
    </div>
    <h3 className="text-xl font-bold text-navy">{c.title}</h3>
    <div className="text-sm font-semibold text-teal mt-1">{c.stats}</div>
    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{c.desc}</p>
    <a
      href={c.href ?? "#"}
      target={c.href ? "_blank" : undefined}
      rel="noreferrer"
      className="mt-5 inline-flex justify-center bg-mint text-navy font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
    >
      Learn More
    </a>
  </div>
);

const Ecosystem = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy">AU's Innovation Ecosystem</h1>
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
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">
          Which path is right for you?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-navy text-white rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold">Want a Job?</h3>
            <p className="mt-3 text-white/70">
              Use the Dashboard to find your target company, then talk to our AI bot for a personal roadmap.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex mt-6 bg-mint text-navy font-semibold px-5 py-2.5 rounded-lg hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="bg-navy text-white rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold">Have a Startup Idea?</h3>
            <p className="mt-3 text-white/70">
              AHub has already funded 90+ startups with ₹62.7Cr. Your idea could be next.
            </p>
            <a
              href="https://www.a-hub.co"
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-6 bg-mint text-navy font-semibold px-5 py-2.5 rounded-lg hover:opacity-90"
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
