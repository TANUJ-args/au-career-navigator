import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

type Alum = {
  Name: string;
  Year: number;
  CGPA: number;
  Internship: "Yes" | "No";
  "Skill Level": "Beginner" | "Intermediate" | "Advanced";
  Skill1: string;
  Skill2: string;
  Skill3: string;
  Role: string;
  Company: string;
  "Placement Type": "On-campus" | "Off-campus";
  Salary: number;
};

type RoleTrack = "All" | "SDE" | "Data" | "Core ";

type TwinCandidate = {
  alum: Alum;
  score: number;
  sharedSkills: string[];
  breakdown: {
    role: number;
    skills: number;
    cgpa: number;
    internship: number;
    year: number;
  };
};

type PlacementPathCard = {
  role: string;
  company: string;
  route: "On-campus" | "Off-campus";
  skills: string[];
};

const MAROON = "#8B1A1A";
const MAROON_LIGHT = "#8B6914";
const MINT = "#0d9488";
const GOLD = "#C9A227";

const LOCAL_ALUMNI_STORAGE_KEY = "au-alumni-mvp-submissions";
const ROLE_TRACKS: RoleTrack[] = ["All", "SDE", "Data"];
const DASHBOARD_SUMMARY_FALLBACK = {
  avgSal: "14.5",
  total: 3001,
  topCompany: "Capgemini",
  topRole: "Data Analyst",
};

const ROADMAP_LINKS: Record<Exclude<RoleTrack, "All">, Array<{ title: string; href: string; note: string }>> = {
  SDE: [
    {
      title: "Backend Developer Roadmap",
      href: "https://roadmap.sh/backend",
      note: "Use this to structure APIs, databases, and deployment skills.",
    },
    {
      title: "Frontend Developer Roadmap",
      href: "https://roadmap.sh/frontend",
      note: "Use this for UI engineering, state management, and testing fundamentals.",
    },
    {
      title: "Full Stack Roadmap",
      href: "https://roadmap.sh/full-stack",
      note: "Use this to combine product-ready frontend and backend execution.",
    },
  ],
  Data: [
    {
      title: "Data Analyst Roadmap",
      href: "https://roadmap.sh/data-analyst",
      note: "Use this to build SQL, BI, and insight communication skills.",
    },
    {
      title: "AI and Data Scientist Roadmap",
      href: "https://roadmap.sh/ai-data-scientist",
      note: "Use this for ML workflow, modeling, and experiment design.",
    },
    {
      title: "Python Roadmap",
      href: "https://roadmap.sh/python",
      note: "Use this to strengthen the core language used in most data roles.",
    },
  ],
  Core: [
    {
      title: "Computer Science Roadmap",
      href: "https://roadmap.sh/computer-science",
      note: "Use this to strengthen fundamentals that transfer across domains.",
    },
    {
      title: "System Design Roadmap",
      href: "https://roadmap.sh/system-design",
      note: "Use this to improve architecture and engineering problem solving.",
    },
    {
      title: "DevOps Roadmap",
      href: "https://roadmap.sh/devops",
      note: "Use this to understand CI/CD, cloud operations, and reliability.",
    },
  ],
};

const isSdeRole = (role: string) => /sde|software|developer|engineer|qa/i.test(role);
const isDataRole = (role: string) => /data|analyst|scientist|ml|ai|bi/i.test(role);

const getRoleTrack = (role: string): Exclude<RoleTrack, "All"> => {
  if (isDataRole(role)) {
    return "Data";
  }
  if (isSdeRole(role)) {
    return "SDE";
  }
  return "Core";
};

const parseSkills = (value: string) =>
  value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .map((skill) => skill.toLowerCase());

const salaryToLpa = (salary: number) => (salary > 1000 ? salary / 100000 : salary);

const formatSkill = (skill: string) =>
  skill
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTopValues = (values: string[], limit: number) => {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
};

const chartTheme = (isDark: boolean) => ({
  grid: "#3a2a1a",
  axis: "#B8A89A",
  tooltipBg: "rgba(31, 15, 15, 0.95)",
  tooltipText: "#FFFFFF",
});

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="glass rounded-2xl p-5 shadow-card border border-[#3a2a1a]">
    <h3 className="text-base md:text-lg font-semibold text-gold mb-3">{title}</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => (
  <label className="flex flex-col">
    <span className="text-sm text-muted-foreground mb-1">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-3 py-2 text-sm text-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const TrackPill = ({
  track,
  active,
  onClick,
}: {
  track: RoleTrack;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
      active
        ? "border-gold bg-gold text-[#0d0d0d]"
        : "border-[#8B6914] bg-[#1f0f0f] text-gold hover:border-gold"
    }`}
  >
    {track}
  </button>
);

const TopPlacementPaths = ({ paths, totalFiltered }: { paths: PlacementPathCard[]; totalFiltered: number }) => (
  <section id="top-placement-paths" className="glass rounded-2xl p-5 border border-[#3a2a1a] shadow-card">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
      <div>
        <h2 className="text-2xl text-gold">Top Placement Paths</h2>
        <p className="text-sm text-muted-foreground">
          Showing {paths.length} anonymized paths from {totalFiltered} filtered outcomes.
        </p>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {paths.map((path, index) => (
        <article
          key={`${path.role}-${path.company}-${path.route}-${index}`}
          className="rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-5 text-ivory shadow-card hover-gold-glow"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B8A89A]">Role</p>
              <h3 className="mt-1 text-lg font-semibold text-gold">{path.role}</h3>
            </div>

            <span className="rounded-full border border-[#8B6914] bg-[#1a0a0a] px-2.5 py-1 text-xs font-semibold text-gold">
              {path.route}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B8A89A]">Company</p>
              <p className="mt-1 text-sm text-ivory">{path.company}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B8A89A]">Key Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {path.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#3a2a1a] bg-[#2a1a1a] px-2.5 py-1 text-xs text-gold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B8A89A]">Route</p>
              <p className="mt-1 text-sm text-ivory">{path.route}</p>
            </div>
          </div>
        </article>
      ))}

      {!paths.length && (
        <div className="md:col-span-2 rounded-2xl border border-[#3a2a1a] bg-[#1f0f0f] p-8 text-center text-muted-foreground">
          No placement paths match the current filters.
        </div>
      )}
    </div>
  </section>
);

const Dashboard = () => {
  const [data, setData] = useState<Alum[]>([]);
  const [localAlumni, setLocalAlumni] = useState<Alum[]>([]);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const [roleTrack, setRoleTrack] = useState<RoleTrack>("All");
  const [year, setYear] = useState("All");
  const [company, setCompany] = useState("All");
  const [role, setRole] = useState("All");
  const [skill, setSkill] = useState("All");

  const [careerProfile, setCareerProfile] = useState({
    targetRole: "Any",
    cgpa: "8.0",
    skills: "",
    internship: "Any",
    startYear: "Any",
  });

  const [twinExplanation, setTwinExplanation] = useState("");
  const [twinExplanationLoading, setTwinExplanationLoading] = useState(false);
  const [twinExplanationHint, setTwinExplanationHint] = useState("");

  const [roadmapSummary, setRoadmapSummary] = useState("");
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapHint, setRoadmapHint] = useState("");

  const [alumniForm, setAlumniForm] = useState({
    name: "",
    year: "2024",
    cgpa: "8.0",
    internship: "Yes",
    skillLevel: "Intermediate",
    skills: "",
    role: "Software Engineer",
    company: "",
    placementType: "On-campus",
    salary: "8.0",
  });
  const [formStatus, setFormStatus] = useState("");
  const [latestPayload, setLatestPayload] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_ALUMNI_STORAGE_KEY);
    if (!cached) {
      return;
    }

    try {
      const parsed: unknown = JSON.parse(cached);
      if (!Array.isArray(parsed)) {
        return;
      }

      const hydrated = parsed.filter((item): item is Alum => {
        if (!item || typeof item !== "object") {
          return false;
        }
        const record = item as Record<string, unknown>;
        return (
          typeof record.Name === "string" &&
          typeof record.Year === "number" &&
          typeof record.CGPA === "number" &&
          typeof record.Role === "string" &&
          typeof record.Company === "string" &&
          typeof record.Salary === "number"
        );
      });

      setLocalAlumni(hydrated);
    } catch {
      setLocalAlumni([]);
    }
  }, []);

  useEffect(() => {
    fetch("/alumni_data.json")
      .then((response) => response.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json as Alum[]);
        } else {
          setData([]);
        }
      })
      .catch(() => setData([]));
  }, []);

  useEffect(() => {
    if (copyStatus === "idle") {
      return;
    }
    const timer = window.setTimeout(() => setCopyStatus("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const allData = useMemo(() => [...localAlumni, ...data], [localAlumni, data]);

  const opts = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr));
    return {
      years: ["All", ...uniq(allData.map((d) => String(d.Year))).sort()],
      companies: ["All", ...uniq(allData.map((d) => d.Company)).sort()],
      roles: ["All", ...uniq(allData.map((d) => d.Role)).sort()],
      skills: ["All", "Beginner", "Intermediate", "Advanced"],
    };
  }, [allData]);

  const filtered = useMemo(
    () =>
      allData.filter(
        (d) =>
          (roleTrack === "All" || getRoleTrack(d.Role) === roleTrack) &&
          (year === "All" || String(d.Year) === year) &&
          (company === "All" || d.Company === company) &&
          (role === "All" || d.Role === role) &&
          (skill === "All" || d["Skill Level"] === skill),
      ),
    [allData, roleTrack, year, company, role, skill],
  );

  const candidatePool = useMemo(() => (filtered.length ? filtered : allData), [filtered, allData]);

  const roleOptionsForTwin = useMemo(() => ["Any", ...opts.roles.filter((r) => r !== "All")], [opts.roles]);
  const yearOptionsForTwin = useMemo(() => ["Any", ...opts.years.filter((y) => y !== "All")], [opts.years]);

  const byCompany = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((d) => m.set(d.Company, (m.get(d.Company) || 0) + 1));
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filtered]);

  const byRole = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((d) => m.set(d.Role, (m.get(d.Role) || 0) + 1));
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filtered]);

  const byYear = useMemo(() => {
    const years = Array.from(new Set(allData.map((entry) => entry.Year))).sort((a, b) => a - b);
    return years.map((y) => {
      const subset = filtered.filter((d) => d.Year === y);
      return {
        year: String(y),
        "On-campus": subset.filter((d) => d["Placement Type"] === "On-campus").length,
        "Off-campus": subset.filter((d) => d["Placement Type"] === "Off-campus").length,
      };
    });
  }, [allData, filtered]);

  const internshipPie = useMemo(
    () => [
      { name: "Internship: Yes", value: filtered.filter((d) => d.Internship === "Yes").length },
      { name: "Internship: No", value: filtered.filter((d) => d.Internship === "No").length },
    ],
    [filtered],
  );

  const salaryBySkill = useMemo(() => {
    const levels = ["Beginner", "Intermediate", "Advanced"] as const;
    return levels.map((level) => {
      const subset = filtered.filter((d) => d["Skill Level"] === level);
      const avg = subset.length ? subset.reduce((sum, d) => sum + salaryToLpa(d.Salary), 0) / subset.length : 0;
      return { name: level, value: Number(avg.toFixed(1)) };
    });
  }, [filtered]);

  const cgpaSalary = useMemo(() => {
    const buckets = [
      { name: "6-7", min: 6, max: 7 },
      { name: "7-8", min: 7, max: 8 },
      { name: "8-9", min: 8, max: 9 },
      { name: "9-10", min: 9, max: 10.01 },
    ];

    return buckets.map((bucket) => {
      const subset = filtered.filter((d) => d.CGPA >= bucket.min && d.CGPA < bucket.max);
      const avg = subset.length ? subset.reduce((sum, d) => sum + salaryToLpa(d.Salary), 0) / subset.length : 0;
      return { name: bucket.name, value: Number(avg.toFixed(1)) };
    });
  }, [filtered]);

  const summary = useMemo(() => {
    if (!data.length) {
      return DASHBOARD_SUMMARY_FALLBACK;
    }

    const avgSal = (data.reduce((sum, d) => sum + salaryToLpa(d.Salary), 0) / data.length).toFixed(1);

    const companyCounts = new Map<string, number>();
    const roleCounts = new Map<string, number>();
    data.forEach((entry) => {
      companyCounts.set(entry.Company, (companyCounts.get(entry.Company) || 0) + 1);
      roleCounts.set(entry.Role, (roleCounts.get(entry.Role) || 0) + 1);
    });

    const topCompany =
      Array.from(companyCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      DASHBOARD_SUMMARY_FALLBACK.topCompany;
    const topRole =
      Array.from(roleCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? DASHBOARD_SUMMARY_FALLBACK.topRole;

    return {
      avgSal: Number.isFinite(Number(avgSal)) ? avgSal : DASHBOARD_SUMMARY_FALLBACK.avgSal,
      total:
        data.length > 0
          ? Math.max(data.length, DASHBOARD_SUMMARY_FALLBACK.total)
          : DASHBOARD_SUMMARY_FALLBACK.total,
      topCompany,
      topRole,
    };
  }, [data]);

  const topPlacementPaths = useMemo<PlacementPathCard[]>(() => {
    const seen = new Set<string>();

    return [...filtered]
      .filter((entry) => entry.Role && entry.Company)
      .sort((a, b) => b.Year - a.Year)
      .filter((entry) => {
        const key = `${entry.Role}|${entry.Company}|${entry["Placement Type"]}`.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, 4)
      .map((entry) => ({
        role: entry.Role,
        company: entry.Company,
        route: entry["Placement Type"],
        skills: [entry.Skill1, entry.Skill2, entry.Skill3].filter(Boolean).slice(0, 3),
      }));
  }, [filtered]);

  const normalizedUserSkills = useMemo(() => parseSkills(careerProfile.skills), [careerProfile.skills]);

  const twinCandidates = useMemo<TwinCandidate[]>(() => {
    const targetCgpa = Number(careerProfile.cgpa) || 8;
    const startYear = careerProfile.startYear === "Any" ? null : Number(careerProfile.startYear);
    const targetRoleTrack =
      careerProfile.targetRole !== "Any"
        ? getRoleTrack(careerProfile.targetRole)
        : roleTrack !== "All"
          ? roleTrack
          : null;

    return candidatePool
      .map((alum) => {
        const alumTrack = getRoleTrack(alum.Role);
        const roleScore =
          careerProfile.targetRole === "Any"
            ? targetRoleTrack
              ? alumTrack === targetRoleTrack
                ? 1
                : 0.45
              : 0.7
            : alum.Role === careerProfile.targetRole
              ? 1
              : alumTrack === getRoleTrack(careerProfile.targetRole)
                ? 0.72
                : 0.2;

        const alumSkills = parseSkills(`${alum.Skill1},${alum.Skill2},${alum.Skill3}`);
        const sharedSkills = normalizedUserSkills.filter((skillName) => alumSkills.includes(skillName));
        const skillsScore = normalizedUserSkills.length
          ? sharedSkills.length / Math.max(normalizedUserSkills.length, 2)
          : 0.6;

        const cgpaScore = Math.max(0, 1 - Math.abs(alum.CGPA - targetCgpa) / 4);
        const internshipScore =
          careerProfile.internship === "Any"
            ? 0.7
            : careerProfile.internship === alum.Internship
              ? 1
              : 0.2;
        const yearScore = startYear === null ? 0.7 : Math.max(0, 1 - Math.abs(alum.Year - startYear) / 5);

        const score =
          (roleScore * 0.35 + skillsScore * 0.3 + cgpaScore * 0.2 + internshipScore * 0.1 + yearScore * 0.05) *
          100;

        return {
          alum,
          score,
          sharedSkills,
          breakdown: {
            role: roleScore,
            skills: skillsScore,
            cgpa: cgpaScore,
            internship: internshipScore,
            year: yearScore,
          },
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [careerProfile, candidatePool, normalizedUserSkills, roleTrack]);

  const peopleLikeYou = useMemo(() => {
    if (!twinCandidates.length) {
      return null;
    }

    const topRole = getTopValues(twinCandidates.map((candidate) => candidate.alum.Role), 1)[0] ?? "-";
    const companies = getTopValues(twinCandidates.map((candidate) => candidate.alum.Company), 2);
    const skills = getTopValues(
      twinCandidates.flatMap((candidate) => [candidate.alum.Skill1, candidate.alum.Skill2, candidate.alum.Skill3]),
      3,
    );
    const avgSalary =
      twinCandidates.reduce((sum, candidate) => sum + salaryToLpa(candidate.alum.Salary), 0) / twinCandidates.length;

    return {
      topRole,
      companies,
      skills,
      avgSalary: avgSalary.toFixed(1),
    };
  }, [twinCandidates]);

  const pathSimulator = useMemo(() => {
    const selectedRole =
      careerProfile.targetRole !== "Any"
        ? careerProfile.targetRole
        : peopleLikeYou?.topRole && peopleLikeYou.topRole !== "-"
          ? peopleLikeYou.topRole
          : opts.roles.find((r) => r !== "All") || "Software Engineer";

    const selectedTrack = getRoleTrack(selectedRole);

    const exactRolePool = allData.filter((item) => item.Role === selectedRole);
    const trackPool = allData.filter((item) => getRoleTrack(item.Role) === selectedTrack);
    const simulationPool = exactRolePool.length ? exactRolePool : trackPool;

    const topSkills = getTopValues(
      simulationPool.flatMap((item) => [item.Skill1, item.Skill2, item.Skill3]),
      4,
    );
    const topHiring = getTopValues(simulationPool.map((item) => item.Company), 3);
    const avgSalary = simulationPool.length
      ? (simulationPool.reduce((sum, item) => sum + salaryToLpa(item.Salary), 0) / simulationPool.length).toFixed(1)
      : "0.0";

    const campusResource =
      selectedTrack === "Data"
        ? "NASSCOM CoE + AU Skill Development Centre"
        : selectedTrack === "SDE"
          ? "Codeium + AU Skill Development Centre"
          : "AU Skill Development Centre + AHub";

    return {
      role: selectedRole,
      track: selectedTrack,
      topSkills,
      topHiring,
      avgSalary,
      campusResource,
      roadmapLinks: ROADMAP_LINKS[selectedTrack],
      plan30: [
        `Master ${topSkills[0] || "core fundamentals"} and ${topSkills[1] || "problem solving"}.`,
        `Complete beginner milestones from ${ROADMAP_LINKS[selectedTrack][0].title}.`,
        `Start one mini project aligned with ${selectedRole}.`,
      ],
      plan60: [
        "Build a portfolio project with measurable outcomes.",
        `Join ${campusResource} sessions for industry tools and mentors.`,
        `Practice mock interviews for ${selectedTrack} track roles.`,
      ],
      plan90: [
        `Apply to ${topHiring.join(", ") || "target companies"} with tailored resumes.`,
        "Publish project outcomes and feedback loop improvements.",
        "Use chatbot follow-ups to optimize your final placement strategy.",
      ],
    };
  }, [careerProfile.targetRole, peopleLikeYou, opts.roles, allData]);

  const chatbotPrefillUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("role", pathSimulator.role);
    params.set("skills", pathSimulator.topSkills.slice(0, 3).join(", "));
    params.set("goal", "Get Placed");
    return `/chatbot?${params.toString()}`;
  }, [pathSimulator.role, pathSimulator.topSkills]);

  const buildFallbackTwinExplanation = () => {
    if (!peopleLikeYou) {
      return "Add profile details to generate your twin explanation.";
    }

    return `Your strongest match trend points to ${peopleLikeYou.topRole}. Alumni with similar profiles most often landed at ${
      peopleLikeYou.companies.join(", ") || "top recruiters"
    } and usually built skills in ${
      peopleLikeYou.skills.map(formatSkill).join(", ") || "core fundamentals"
    }. Typical outcome in this lane is around Rs ${peopleLikeYou.avgSalary} LPA.`;
  };

  const handleExplainTwin = async () => {
    if (!twinCandidates.length) {
      return;
    }

    setTwinExplanationLoading(true);
    setTwinExplanationHint("");

    const prompt = `You are helping with Career Twin in AU Career Compass.

Student profile:
- Target role: ${careerProfile.targetRole}
- CGPA: ${careerProfile.cgpa}
- Skills: ${careerProfile.skills || "none provided"}
- Internship preference: ${careerProfile.internship}
- Start year preference: ${careerProfile.startYear}

Top twin matches:
${twinCandidates
  .map(
    (candidate, index) =>
      `${index + 1}. ${candidate.alum.Name} | ${candidate.alum.Role} at ${candidate.alum.Company} | Score ${candidate.score.toFixed(
        1,
      )}% | Shared skills: ${candidate.sharedSkills.join(", ") || "none"}`,
  )
  .join("\n")}

Generate:
1) One concise explanation of why these are good career twins.
2) A simple "people like you usually choose" recommendation.
3) Keep it under 120 words.`;

    try {
      const { data: replyData, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [{ role: "user", text: prompt }],
        },
      });

      if (error) {
        throw error;
      }

      const reply = typeof replyData?.reply === "string" ? replyData.reply.trim() : "";
      if (!reply) {
        throw new Error("Empty AI response.");
      }

      setTwinExplanation(reply);
    } catch {
      setTwinExplanation(buildFallbackTwinExplanation());
      setTwinExplanationHint("Live AI explanation unavailable. Showing deterministic recommendation.");
    } finally {
      setTwinExplanationLoading(false);
    }
  };

  const buildFallbackRoadmapSummary = () =>
    `Focus first on ${pathSimulator.topSkills.map(formatSkill).join(", ") || "role fundamentals"}. Follow ${
      pathSimulator.roadmapLinks[0].title
    } to set weekly milestones. By day 60, convert progress into one portfolio project. By day 90, target ${
      pathSimulator.topHiring.join(", ") || "relevant companies"
    } with role-specific resumes and mock interview practice.`;

  const handleGenerateRoadmapSummary = async () => {
    setRoadmapLoading(true);
    setRoadmapHint("");

    const prompt = `Create a concise roadmap summary for an Andhra University student.
Target role: ${pathSimulator.role}
Role track: ${pathSimulator.track}
Top skills: ${pathSimulator.topSkills.join(", ") || "N/A"}
Top hiring companies: ${pathSimulator.topHiring.join(", ") || "N/A"}

Roadmap links:
${pathSimulator.roadmapLinks.map((link) => `${link.title}: ${link.href}`).join("\n")}

Return 4 short, action-oriented bullets under 120 words.`;

    try {
      const { data: replyData, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          messages: [{ role: "user", text: prompt }],
        },
      });

      if (error) {
        throw error;
      }

      const reply = typeof replyData?.reply === "string" ? replyData.reply.trim() : "";
      if (!reply) {
        throw new Error("Empty roadmap summary.");
      }

      setRoadmapSummary(reply);
    } catch {
      setRoadmapSummary(buildFallbackRoadmapSummary());
      setRoadmapHint("Live AI roadmap summary unavailable. Showing deterministic roadmap summary.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleAddAlumniJourney = (event: FormEvent) => {
    event.preventDefault();

    const parsedYear = Number(alumniForm.year);
    const parsedCgpa = Number(alumniForm.cgpa);
    const parsedSalary = Number(alumniForm.salary);

    if (
      !alumniForm.name.trim() ||
      !alumniForm.company.trim() ||
      Number.isNaN(parsedYear) ||
      Number.isNaN(parsedCgpa) ||
      Number.isNaN(parsedSalary)
    ) {
      setFormStatus("Please complete name, company, year, CGPA, and salary before submitting.");
      return;
    }

    const skillTokens = parseSkills(alumniForm.skills)
      .slice(0, 3)
      .map(formatSkill);

    while (skillTokens.length < 3) {
      skillTokens.push("General");
    }

    const payload: Alum = {
      Name: alumniForm.name.trim(),
      Year: parsedYear,
      CGPA: Number(parsedCgpa.toFixed(2)),
      Internship: alumniForm.internship as Alum["Internship"],
      "Skill Level": alumniForm.skillLevel as Alum["Skill Level"],
      Skill1: skillTokens[0],
      Skill2: skillTokens[1],
      Skill3: skillTokens[2],
      Role: alumniForm.role.trim(),
      Company: alumniForm.company.trim(),
      "Placement Type": alumniForm.placementType as Alum["Placement Type"],
      Salary: parsedSalary,
    };

    const updated = [payload, ...localAlumni];
    setLocalAlumni(updated);
    localStorage.setItem(LOCAL_ALUMNI_STORAGE_KEY, JSON.stringify(updated));

    const payloadText = JSON.stringify(payload, null, 2);
    setLatestPayload(payloadText);
    setFormStatus("Journey added to local MVP storage. Copy JSON to merge into alumni_data.json later.");

    setAlumniForm((prev) => ({
      ...prev,
      name: "",
      company: "",
      skills: "",
    }));
  };

  const handleCopyPayload = async () => {
    if (!latestPayload) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestPayload);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const handleClearLocalEntries = () => {
    setLocalAlumni([]);
    localStorage.removeItem(LOCAL_ALUMNI_STORAGE_KEY);
    setFormStatus("Local alumni MVP entries cleared.");
  };

  const skillColors = [MAROON_LIGHT, GOLD, MINT];
  const theme = chartTheme(isDark);
  const tooltipProps = {
    contentStyle: {
      background: theme.tooltipBg,
      border: `1px solid ${isDark ? "#61424D" : "#D6C1A6"}`,
      borderRadius: "0.75rem",
    },
    labelStyle: { color: theme.tooltipText, fontWeight: 700 },
    itemStyle: { color: theme.tooltipText },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-gold font-semibold uppercase tracking-[0.18em] text-xs md:text-sm">Data Intelligence</p>
        <h1 className="text-3xl md:text-5xl text-gold mt-2">Alumni Insights Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real placement intelligence from AU alumni. Explore outcomes, find your career twin, and plan your next move.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {ROLE_TRACKS.map((track) => (
          <TrackPill key={track} track={track} active={roleTrack === track} onClick={() => setRoleTrack(track)} />
        ))}
      </div>

      <div className="glass rounded-2xl p-5 shadow-card border border-[#3a2a1a] grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Select label="Year" value={year} onChange={setYear} options={opts.years} />
        <Select label="Company" value={company} onChange={setCompany} options={opts.companies} />
        <Select label="Role" value={role} onChange={setRole} options={opts.roles} />
        <Select label="Skill Level" value={skill} onChange={setSkill} options={opts.skills} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#3a2a1a] bg-[#0d0d0d] px-3 py-2">
        <a
          href="#dashboard-insights"
          className="rounded-full bg-[#1f0f0f] border border-[#8B6914] px-3 py-1.5 text-xs font-semibold text-gold hover:border-gold"
        >
          Dashboard
        </a>
        <a
          href="#career-twin"
          className="rounded-full bg-[#1f0f0f] border border-[#8B6914] px-3 py-1.5 text-xs font-semibold text-gold hover:border-gold"
        >
          Career Twin
        </a>
        <a
          href="#path-simulator"
          className="rounded-full bg-[#1f0f0f] border border-[#8B6914] px-3 py-1.5 text-xs font-semibold text-gold hover:border-gold"
        >
          Path Simulator
        </a>
        <a
          href="#top-placement-paths"
          className="rounded-full bg-[#1f0f0f] border border-[#8B6914] px-3 py-1.5 text-xs font-semibold text-gold hover:border-gold"
        >
          Top Placement Paths
        </a>
        <a
          href="#alumni-form"
          className="rounded-full bg-[#1f0f0f] border border-[#8B6914] px-3 py-1.5 text-xs font-semibold text-gold hover:border-gold"
        >
          Alumni Form
        </a>
      </div>

      <section className="grid gap-6 xl:grid-cols-12 items-start">
        <div id="dashboard-insights" className="space-y-6 xl:col-span-7">
          <div className="grid md:grid-cols-2 gap-6">
            <ChartCard title="Top Hiring Companies">
              <BarChart data={byCompany} margin={{ top: 5, right: 10, bottom: 30, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  stroke={theme.axis}
                  fontSize={12}
                />
                <YAxis stroke={theme.axis} fontSize={12} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="value" fill={MAROON_LIGHT} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartCard>

            <ChartCard title="Most In-Demand Roles">
              <BarChart data={byRole} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis type="number" stroke={theme.axis} fontSize={12} />
                <YAxis dataKey="name" type="category" width={130} stroke={theme.axis} fontSize={12} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="value" fill={GOLD} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartCard>

            <ChartCard title="Placement Trends (2020-2024)">
              <BarChart data={byYear}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis dataKey="year" stroke={theme.axis} fontSize={12} />
                <YAxis stroke={theme.axis} fontSize={12} />
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ color: theme.axis }} />
                <Bar dataKey="On-campus" fill={MAROON} radius={[8, 8, 0, 0]} />
                <Bar dataKey="Off-campus" fill={GOLD} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartCard>

            <ChartCard title="Internship Conversion Rate">
              <PieChart>
                <Pie data={internshipPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  <Cell fill={GOLD} />
                  <Cell fill={MAROON_LIGHT} />
                </Pie>
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ color: theme.axis }} />
              </PieChart>
            </ChartCard>

            <ChartCard title="Avg Salary by Skill Level (LPA)">
              <BarChart data={salaryBySkill}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis dataKey="name" stroke={theme.axis} fontSize={12} />
                <YAxis stroke={theme.axis} fontSize={12} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {salaryBySkill.map((_, i) => (
                    <Cell key={i} fill={skillColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartCard>

            <ChartCard title="CGPA vs Salary Correlation (LPA)">
              <LineChart data={cgpaSalary}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis dataKey="name" stroke={theme.axis} fontSize={12} />
                <YAxis stroke={theme.axis} fontSize={12} />
                <Tooltip {...tooltipProps} />
                <Line type="monotone" dataKey="value" stroke={MINT} strokeWidth={3} dot={{ r: 5, fill: MINT }} />
              </LineChart>
            </ChartCard>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Average Salary", value: `₹${summary.avgSal} LPA` },
              { label: "Total Placements", value: summary.total },
              { label: "Top Company", value: summary.topCompany },
              { label: "Top Role", value: summary.topRole },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 border border-[#3a2a1a] bg-[#1f0f0f] text-ivory shadow-card hover-gold-glow"
              >
                <div className="text-gold text-2xl font-extrabold">{s.value}</div>
                <div className="text-[#B8A89A] text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <TopPlacementPaths paths={topPlacementPaths} totalFiltered={filtered.length} />
        </div>

        <div className="space-y-6 xl:col-span-5">
          <section id="career-twin" className="glass rounded-2xl p-6 border border-[#3a2a1a] shadow-card">
            <h2 className="text-2xl text-gold">Find Your Career Twin</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Match with alumni who started from a similar point and see where they reached.
            </p>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <Select
                label="Target Role"
                value={careerProfile.targetRole}
                onChange={(value) => setCareerProfile((prev) => ({ ...prev, targetRole: value }))}
                options={roleOptionsForTwin}
              />

              <label className="flex flex-col text-sm">
                <span className="text-muted-foreground mb-1 font-medium tracking-wide">Your CGPA</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="0.01"
                  value={careerProfile.cgpa}
                  onChange={(event) => setCareerProfile((prev) => ({ ...prev, cgpa: event.target.value }))}
                  className="bg-[#2a1a1a] border border-[#3a2a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <Select
                label="Internship Preference"
                value={careerProfile.internship}
                onChange={(value) => setCareerProfile((prev) => ({ ...prev, internship: value }))}
                options={["Any", "Yes", "No"]}
              />

              <Select
                label="Start Year Match"
                value={careerProfile.startYear}
                onChange={(value) => setCareerProfile((prev) => ({ ...prev, startYear: value }))}
                options={yearOptionsForTwin}
              />

              <label className="sm:col-span-2 flex flex-col text-sm">
                <span className="text-muted-foreground mb-1 font-medium tracking-wide">Skills (comma separated)</span>
                <input
                  type="text"
                  value={careerProfile.skills}
                  onChange={(event) => setCareerProfile((prev) => ({ ...prev, skills: event.target.value }))}
                  placeholder="Python, SQL, React"
                  className="bg-[#2a1a1a] border border-[#3a2a1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
            </div>

            <div className="mt-5 space-y-3">
              {twinCandidates.map((candidate, index) => (
                <div
                  key={`${candidate.alum.Name}-${candidate.alum.Company}-${index}`}
                  className="rounded-xl border border-[#3a2a1a] bg-[#1f0f0f] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gold">{candidate.alum.Name}</p>
                      <p className="text-sm text-muted-foreground">
                        {candidate.alum.Role} at {candidate.alum.Company} ({candidate.alum.Year})
                      </p>
                    </div>
                    <span className="rounded-full border border-[#8B6914] bg-[#1a0a0a] px-2.5 py-1 text-xs font-semibold text-gold">
                      {candidate.score.toFixed(1)}% match
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Skills: {candidate.sharedSkills.length ? candidate.sharedSkills.map(formatSkill).join(", ") : "Based on profile match"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Score mix: role {(candidate.breakdown.role * 100).toFixed(0)}%, skills{" "}
                    {(candidate.breakdown.skills * 100).toFixed(0)}%, cgpa {(candidate.breakdown.cgpa * 100).toFixed(0)}%
                  </p>
                </div>
              ))}

              {!twinCandidates.length && (
                <p className="text-sm text-muted-foreground">Add filters or profile data to generate twin matches.</p>
              )}
            </div>

            {peopleLikeYou && (
              <div className="mt-4 rounded-xl border border-[#3a2a1a] bg-[#1f0f0f] p-4">
                <p className="text-sm font-semibold text-gold">People like you chose this path</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Most similar alumni moved into <strong>{peopleLikeYou.topRole}</strong>, commonly joined{" "}
                  {peopleLikeYou.companies.join(", ") || "top recruiters"}, and built{" "}
                  {peopleLikeYou.skills.map(formatSkill).join(", ")} before landing roles around{" "}
                  <strong>Rs {peopleLikeYou.avgSalary} LPA</strong>.
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExplainTwin}
                disabled={twinExplanationLoading || !twinCandidates.length}
                className="rounded-xl bg-gold text-[#0d0d0d] font-semibold px-4 py-2 hover:bg-gold-soft disabled:opacity-50"
              >
                {twinExplanationLoading ? "Generating AI twin insight..." : "Generate AI twin explanation"}
              </button>
              {twinExplanationHint && <span className="text-xs text-muted-foreground">{twinExplanationHint}</span>}
            </div>

            {twinExplanation && (
              <div className="mt-4 rounded-xl border border-[#3a2a1a] bg-[#1f0f0f] p-4">
                <p className="text-sm font-semibold text-gold">Twin Insight</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{twinExplanation}</p>
              </div>
            )}
          </section>

          <section id="path-simulator" className="glass rounded-2xl p-6 border border-[#3a2a1a] shadow-card">
            <h2 className="text-2xl text-gold">Path Simulator and Next Step Recommendation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Role-based action path generated from alumni outcomes and roadmap context.
            </p>

            <div className="mt-4 rounded-xl border border-[#3a2a1a] bg-[#1f0f0f] p-4">
              <p className="text-sm text-muted-foreground">Likely role path</p>
              <p className="text-lg font-semibold text-gold">{pathSimulator.role}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Track: {pathSimulator.track} · Avg salary trend <strong>Rs {pathSimulator.avgSalary} LPA</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Frequent hiring companies: {pathSimulator.topHiring.join(", ") || "No companies found"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Campus route: {pathSimulator.campusResource}</p>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#3a2a1a] p-3 bg-[#1f0f0f]">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">30 days</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {pathSimulator.plan30.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#3a2a1a] p-3 bg-[#1f0f0f]">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">60 days</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {pathSimulator.plan60.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#3a2a1a] p-3 bg-[#1f0f0f]">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">90 days</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {pathSimulator.plan90.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#3a2a1a] bg-[#1f0f0f] p-4">
              <p className="text-sm font-semibold text-gold">Role-based roadmap context from roadmap.sh</p>
              <div className="mt-2 space-y-2">
                {pathSimulator.roadmapLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-[#3a2a1a] px-3 py-2 hover:bg-[#2a1a1a] transition-colors"
                  >
                    <p className="font-semibold text-sm text-gold">{link.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.note}</p>
                  </a>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateRoadmapSummary}
                  disabled={roadmapLoading}
                  className="rounded-xl bg-gold text-[#0d0d0d] font-semibold px-4 py-2 hover:bg-gold-soft disabled:opacity-50"
                >
                  {roadmapLoading ? "Generating AI roadmap summary..." : "Generate AI roadmap summary"}
                </button>
                {roadmapHint && <span className="text-xs text-muted-foreground">{roadmapHint}</span>}
              </div>

             {roadmapSummary && (
  <div
    className="mt-3 text-sm text-muted-foreground space-y-1 leading-relaxed [&_strong]:text-gold [&_strong]:font-semibold"
    dangerouslySetInnerHTML={{
      __html: roadmapSummary
        // Bold: **text** → <strong>text</strong>
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Bullet lines: lines starting with * or - → <li> items
        .replace(/^[*-]\s+(.+)$/gm, "<li class='flex gap-2'><span class='text-gold mt-0.5'>▸</span><span>$1</span></li>")
        // Numbered lines: 1. text → ordered items
        .replace(/^\d+\.\s+(.+)$/gm, "<li class='flex gap-2'><span class='text-gold mt-0.5'>▸</span><span>$1</span></li>")
        // Wrap consecutive <li> blocks in <ul>
        .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class='space-y-2 mt-1'>${match}</ul>`)
        // Remaining plain paragraphs
        .replace(/^(?!<[ul|li]).+$/gm, (line) => line.trim() ? `<p>${line}</p>` : ""),
    }}
  />
)}
              <Link
                to={chatbotPrefillUrl}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0d9488] text-[#0d0d0d] font-semibold px-4 py-2 hover:bg-[#0b7f75] transition-colors"
              >
                Continue in AI Mentor with this path
              </Link>
            </div>
          </section>
        </div>  
      </section> 
    </div>
  );
};

export default Dashboard;