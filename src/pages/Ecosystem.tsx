import { Link } from "react-router-dom";

type PillarAccent = "gold" | "teal" | "purple" | "navy";

type Pillar = {
  emoji: string;
  title: string;
  description: string;
  accent: PillarAccent;
  large?: boolean;
};

type IncubatorCard = {
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  stats?: string;
  buttonLabel?: string;
  href?: string;
  featured?: boolean;
};

type LabItem = {
  name: string;
  learn: string;
  career: string;
};

const statPills = [
  "🎯 Training",
  "🛠️ Skills",
  "💡 Innovation",
  "🚀 Incubation",
  "🤝 Industry",
];

const pillars: Pillar[] = [
  {
    emoji: "🎯",
    title: "Training & Placements",
    accent: "gold",
    description:
      "Aptitude training, mock interviews, campus recruitment drives, and corporate connect with 100+ recruiters.",
  },
  {
    emoji: "🛠️",
    title: "Skill Development",
    accent: "teal",
    description:
      "Hands-on labs in IoT, Robotics, AI, CNC, 3D Printing, and Industry 4.0. Train on tools companies actually use.",
  },
  {
    emoji: "💡",
    title: "Innovation (IIC)",
    accent: "purple",
    description:
      "Institution's Innovation Council - Hackathons, Ideathons, and student innovation initiatives backed by Ministry of Education.",
  },
  {
    emoji: "🚀",
    title: "Incubation (ā Hub / AUIC)",
    accent: "gold",
    large: true,
    description:
      "90+ startups incubated. Significant funding raised by portfolio startups. 4★ IIC Rating 3 years running. Only institution in AP to achieve this from year one.",
  },
  {
    emoji: "🤝",
    title: "Industry Connect",
    accent: "navy",
    description:
      "MoUs with leading companies. Live projects, guest lectures, industrial visits, and internships.",
  },
];

const incubationCards: IncubatorCard[] = [
  {
    title: "ā Hub (AUIC) ⭐",
    badge: "Flagship",
    badgeClass: "border border-[#8B6914] bg-[#1a0a0a] text-gold",
    stats: "90+ Startups | Significant funding raised by portfolio startups | 500+ Jobs | 4★ IIC",
    featured: true,
    description:
      "Not-for-profit incubator using MESH framework - Mentoring, Equipping, Strategizing, Hand-holding. Seed funding up to ₹10L via NIDHI iTBI. NIRF Innovation Ranking Band 11-50 - highest among public-funded universities.",
    buttonLabel: "Visit ā Hub →",
    href: "https://www.a-hub.co",
  },
  {
    title: "Meity GoAP Incubator",
    badge: "AI & IoT",
    badgeClass: "border border-[#8B6914] bg-[#1a0a0a] text-gold",
    description:
      "NASSCOM Centre of Excellence for IoT & AI. Joint initiative by MeitY and Government of Andhra Pradesh. ₹131Cr ecosystem. 65-seat startup lab. Open to AU students for IoT and deep-tech projects.",
  },
  {
    title: "TheDigiFac Incubator",
    badge: "Low-Code",
    badgeClass: "border border-[#8B6914] bg-[#1a0a0a] text-gold",
    description:
      "AU alumni-founded Low-Code tech incubator. Recognized by Times of India as top contributor to AU's digital transformation. Focus on OutSystems and no-code platforms.",
  },
  {
    title: "Avanti Incubator",
    badge: "Marine Tech",
    badgeClass: "border border-[#8B6914] bg-[#1a0a0a] text-gold",
    description:
      "Specialized incubation for marine and aquaculture technology startups. In collaboration with Avanti Feeds Ltd.",
  },
  {
    title: "ELEMENT",
    badge: "Pharma & BioTech",
    badgeClass: "border border-[#8B6914] bg-[#1a0a0a] text-gold",
    description:
      "Incubation for pharma, biotechnology, and food technology innovators. Supports health-tech and life sciences startups from ideation to prototype.",
  },
];

const labs: LabItem[] = [
  {
    name: "Mechatronics Lab",
    learn: "Mechanical + Electrical + Control Systems",
    career: "Mechatronics Engineer",
  },
  {
    name: "Industrial Robotics Lab",
    learn: "Robotic arm control, automation",
    career: "Robotics Programmer",
  },
  {
    name: "NC Programming Lab",
    learn: "CNC, CAM software, tool path",
    career: "CNC Programmer",
  },
  {
    name: "Rapid Prototyping Lab",
    learn: "3D Printing, Additive Manufacturing",
    career: "Prototype Engineer, R&D",
  },
  {
    name: "Automation Lab",
    learn: "PLC, SCADA, IoT, Industrial control",
    career: "Automation Engineer",
  },
  {
    name: "AU i Factory Network Lab",
    learn: "Industry 4.0, Digital Twins, AI integration",
    career: "Smart Manufacturing Engineer",
  },
  {
    name: "AU FABLAB",
    learn: "IoT Prototype Development",
    career: "IoT Developer",
  },
  {
    name: "SIEMENS CoE (APSSDC)",
    learn: "Advanced manufacturing systems",
    career: "Manufacturing Engineer",
  },
  {
    name: "nasscom Future Skills",
    learn: "AI, Data Science, Digital skills",
    career: "Data Analyst, AI Engineer",
  },
];

const recruiterRowOne = [
  "TCS",
  "Accenture",
  "Wipro",
  "Amazon",
  "Google",
  "Microsoft",
  "IBM",
  "Deloitte",
  "Capgemini",
  "Infosys",
  "Airtel",
  "HDFC Bank",
];

const recruiterRowTwo = [
  "Mahindra",
  "D-Mart",
  "Reliance",
  "Tata Projects",
  "Dr. Reddy's",
  "Divi's",
  "Hetero",
  "Aragen",
  "Asian Paints",
  "Parle",
  "PolicyBazaar",
  "Muthoot Finance",
];

const timelineSteps = [
  {
    emoji: "📚",
    title: "Skill Courses",
    description:
      "Join industry-integrated skill courses run by CPDC. Entrance test for high-demand programs.",
  },
  {
    emoji: "💼",
    title: "Internships",
    description:
      "Work on live industry projects. Build professional networks through CPDC corporate connect.",
  },
  {
    emoji: "🔬",
    title: "Research & Projects",
    description:
      "6-month UG/PG dissertation with Emerging Tech Labs support. Leads to patents and publications.",
  },
  {
    emoji: "🚀",
    title: "Incubation",
    description:
      "Have an idea? Start at pre-incubation, graduate to ā Hub for full funding and startup resources.",
  },
];

const pillarTopBorderClass: Record<PillarAccent, string> = {
  gold: "border-t-[#8B6914]",
  teal: "border-t-[#8B6914]",
  purple: "border-t-[#8B6914]",
  navy: "border-t-[#8B6914]",
};

const sectionCardClass = "w-full rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-4 shadow-card md:p-6";

const RecruiterTicker = ({ companies, slower = false }: { companies: string[]; slower?: boolean }) => (
  <div className="cpdc-marquee-row overflow-hidden rounded-xl border border-[#3a2a1a] bg-[#0d0d0d] py-3">
    <div className={`cpdc-marquee-track ${slower ? "cpdc-marquee-track-slower" : ""}`}>
      {[...companies, ...companies].map((company, index) => (
        <span
          key={`${company}-${index}`}
          className="inline-flex min-h-11 items-center rounded-full border border-[#8B6914] bg-[#1f0f0f] px-4 text-sm text-gold"
        >
          {company}
        </span>
      ))}
    </div>
  </div>
);

const Ecosystem = () => {
  return (
    <div className="cpdc-page min-h-screen scroll-smooth overflow-x-hidden bg-[#1a0a0a] text-ivory pb-28 md:pb-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:space-y-10 md:py-12">
        <header className="space-y-2 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90 md:text-sm">CPDC @ AU</p>
          <h1 className="text-3xl leading-tight text-ivory md:text-5xl">AU's Career & Innovation Ecosystem</h1>
          <p className="text-lg font-semibold text-gold">Career Planning & Development Centre</p>
          <p className="text-sm text-[#B8A89A]">
            Empowering Futures • Inspiring Innovation - Building Entrepreneurs
          </p>
          <p className="mt-4 text-center text-sm italic text-gold">
            This platform makes CPDC's resources discoverable to every AU student — not just those who happen to know
            about them.
          </p>
          <a href="mailto:cpdc@andhrauniversity.edu.in" className="inline-block text-sm text-gold hover:underline">
            cpdc@andhrauniversity.edu.in
          </a>
        </header>

        <section id="cpdc-overview" className={sectionCardClass}>
          <h2 className="text-2xl font-semibold text-gold">What is CPDC?</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#B8A89A] md:text-base">
            The Career Planning & Development Centre is AU's unified platform for Training & Placements, Skill
            Development, Industry 4.0 Labs, Innovation, Incubation, and Industry Connect - established in Andhra
            University's 100th year.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {statPills.map((pill) => (
              <span key={pill} className="inline-flex min-h-11 items-center rounded-full border border-[#8B6914] bg-[#1f0f0f] px-4 text-sm text-gold">
                {pill}
              </span>
            ))}
          </div>
        </section>

        <section id="pillars" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gold">5 Pillars of CPDC</h2>

          <div className="overflow-x-auto pb-2 md:hidden">
            <div className="flex w-max gap-4 pr-4">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className={`w-[90vw] max-w-[360px] rounded-2xl border border-[#3a2a1a] border-t-4 ${pillarTopBorderClass[pillar.accent]} bg-[#1f0f0f] p-4 shadow-card`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#B8A89A]">{pillar.emoji} CPDC Pillar</p>
                  <h3 className="mt-2 text-xl text-gold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#B8A89A]">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hidden gap-4 md:grid md:grid-cols-6">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className={`rounded-2xl border border-[#3a2a1a] border-t-4 ${pillarTopBorderClass[pillar.accent]} bg-[#1f0f0f] p-5 shadow-card ${
                  index < 3 ? "md:col-span-2" : "md:col-span-3"
                } ${pillar.large ? "md:min-h-[250px]" : ""}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#B8A89A]">{pillar.emoji} CPDC Pillar</p>
                <h3 className="mt-2 text-xl text-gold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8A89A]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="incubation" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gold">Incubation Centres on Campus</h2>
            <p className="mt-2 text-sm text-[#B8A89A] md:text-base">
              5 specialized incubators under AUIC - one of the largest multi-disciplinary incubation ecosystems in India
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {incubationCards.map((card) => (
              <article
                key={card.title}
                className={`w-full rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-4 shadow-card md:p-5 ${
                  card.featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl text-gold">{card.title}</h3>
                  <span className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>

                {card.stats ? <p className="mt-3 text-sm font-semibold text-gold">{card.stats}</p> : null}

                <p className="mt-3 text-sm leading-relaxed text-[#B8A89A]">{card.description}</p>

                {card.href && card.buttonLabel ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-[#0d0d0d] hover:bg-gold-soft"
                  >
                    {card.buttonLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="labs" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gold">Industry-Grade Labs on Campus</h2>
            <p className="mt-2 text-sm text-[#B8A89A] md:text-base">Train on what companies use</p>
          </div>

          <div className="overflow-x-auto pb-2 md:hidden">
            <div className="flex w-max gap-4 pr-4">
              {labs.map((lab) => (
                <article key={lab.name} className="w-[90vw] max-w-[360px] rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-4 shadow-card">
                  <h3 className="text-lg text-gold">{lab.name}</h3>
                  <span className="mt-2 inline-flex min-h-8 items-center rounded-full border border-[#8B6914] bg-[#1a0a0a] px-3 text-xs font-semibold text-gold">
                    Learn
                  </span>
                  <p className="mt-3 text-sm text-[#B8A89A]">{lab.learn}</p>
                  <p className="mt-2 text-sm font-semibold text-ivory">Career: {lab.career}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] md:block">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#8B6914]/50 text-gold">
                  <th className="px-4 py-3 font-semibold">Lab</th>
                  <th className="px-4 py-3 font-semibold">What You Learn</th>
                  <th className="px-4 py-3 font-semibold">Career Path</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((lab) => (
                  <tr key={lab.name} className="border-b border-[#3a2a1a] last:border-b-0">
                    <td className="px-4 py-3 text-ivory">{lab.name}</td>
                    <td className="px-4 py-3 text-[#B8A89A]">{lab.learn}</td>
                    <td className="px-4 py-3 text-[#B8A89A]">{lab.career}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="recruiters" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gold">Companies That Hire from AU</h2>
            <p className="mt-2 text-sm text-[#B8A89A] md:text-base">100+ recruiters. Every domain.</p>
          </div>
          <div className="space-y-3">
            <RecruiterTicker companies={recruiterRowOne} />
            <RecruiterTicker companies={recruiterRowTwo} slower />
          </div>
        </section>

        <section id="engage" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gold">Your Path Through CPDC</h2>
          <div className="relative rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-4 md:p-6">
            <div className="absolute bottom-10 left-5 top-10 hidden w-px bg-gold/40 md:block" />
            <div className="space-y-5">
              {timelineSteps.map((step, index) => (
                <article key={step.title} className="relative flex items-start gap-3 md:gap-4">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-[#0d0d0d]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gold">
                      {step.emoji} {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#B8A89A]">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="w-full rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-5 shadow-card md:p-6">
            <h3 className="text-2xl text-gold">💼 Want a Job?</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#B8A89A]">
              Use the Alumni Dashboard + AI Mentor to find your target company and build your roadmap.
            </p>
            <Link
              to="/dashboard"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0d9488] px-5 text-sm font-bold text-[#0d0d0d] hover:bg-[#0b7f75]"
            >
              Open Dashboard
            </Link>
          </article>

          <article className="w-full rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-5 shadow-card md:p-6">
            <h3 className="text-2xl text-gold">🚀 Have a Startup Idea?</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#B8A89A]">
              ā Hub has already supported 90+ startups with significant funding raised by portfolio startups. Your idea could be next.
            </p>
            <a
              href="https://www.a-hub.co"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-5 text-sm font-bold text-[#0d0d0d] hover:bg-gold-soft"
            >
              Visit ā Hub →
            </a>
          </article>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3a2a1a] bg-[#0d0d0d]/95 backdrop-blur md:hidden">
        <div
          className="mx-auto flex max-w-7xl items-center justify-around gap-1 px-2 py-2"
          style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        >
          {[
            { href: "#cpdc-overview", label: "Overview" },
            { href: "#pillars", label: "Pillars" },
            { href: "#labs", label: "Labs" },
            { href: "#engage", label: "Path" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#8B6914] bg-[#1f0f0f] px-2 text-[11px] font-semibold text-gold"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <style>{`
        .cpdc-marquee-track {
          display: flex;
          gap: 0.75rem;
          width: max-content;
          animation: cpdc-marquee-left 30s linear infinite;
          will-change: transform;
        }

        .cpdc-marquee-track-slower {
          animation-duration: 36s;
        }

        @keyframes cpdc-marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cpdc-marquee-track,
          .cpdc-marquee-track-slower {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Ecosystem;
