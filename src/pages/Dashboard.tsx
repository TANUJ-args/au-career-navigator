import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

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

const TEAL = "#0A84A8";
const MINT = "#02C39A";
const GOLD = "#F4B942";
const NAVY = "#021B2E";

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl p-5 shadow-card border border-border">
    <h3 className="font-bold text-navy mb-4">{title}</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children as any}
      </ResponsiveContainer>
    </div>
  </div>
);

const Select = ({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <label className="flex flex-col text-sm">
    <span className="text-muted-foreground mb-1 font-medium">{label}</span>
    <select
      className="bg-card border border-border rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-mint"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

const Dashboard = () => {
  const [data, setData] = useState<Alum[]>([]);
  const [year, setYear] = useState("All");
  const [company, setCompany] = useState("All");
  const [role, setRole] = useState("All");
  const [skill, setSkill] = useState("All");

  useEffect(() => {
    fetch("/alumni_data.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const opts = useMemo(() => {
    const uniq = (arr: (string | number)[]) => Array.from(new Set(arr));
    return {
      years: ["All", ...uniq(data.map((d) => String(d.Year))).sort()],
      companies: ["All", ...uniq(data.map((d) => d.Company)).sort()],
      roles: ["All", ...uniq(data.map((d) => d.Role)).sort()],
      skills: ["All", "Beginner", "Intermediate", "Advanced"],
    };
  }, [data]);

  const filtered = useMemo(
    () =>
      data.filter(
        (d) =>
          (year === "All" || String(d.Year) === year) &&
          (company === "All" || d.Company === company) &&
          (role === "All" || d.Role === role) &&
          (skill === "All" || d["Skill Level"] === skill),
      ),
    [data, year, company, role, skill],
  );

  // Aggregations
  const byCompany = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((d) => m.set(d.Company, (m.get(d.Company) || 0) + 1));
    return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [filtered]);

  const byRole = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((d) => m.set(d.Role, (m.get(d.Role) || 0) + 1));
    return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  const byYear = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024];
    return years.map((y) => {
      const subset = filtered.filter((d) => d.Year === y);
      return {
        year: String(y),
        "On-campus": subset.filter((d) => d["Placement Type"] === "On-campus").length,
        "Off-campus": subset.filter((d) => d["Placement Type"] === "Off-campus").length,
      };
    });
  }, [filtered]);

  const internshipPie = useMemo(() => {
    const yes = filtered.filter((d) => d.Internship === "Yes").length;
    const no = filtered.filter((d) => d.Internship === "No").length;
    return [
      { name: "Internship: Yes", value: yes },
      { name: "Internship: No", value: no },
    ];
  }, [filtered]);

  const salaryBySkill = useMemo(() => {
    const levels = ["Beginner", "Intermediate", "Advanced"];
    return levels.map((lvl) => {
      const sub = filtered.filter((d) => d["Skill Level"] === lvl);
      const avg = sub.length ? sub.reduce((s, d) => s + d.Salary, 0) / sub.length : 0;
      return { name: lvl, value: +avg.toFixed(1) };
    });
  }, [filtered]);

  const cgpaSalary = useMemo(() => {
    const buckets = [
      { name: "6-7", min: 6, max: 7 },
      { name: "7-8", min: 7, max: 8 },
      { name: "8-9", min: 8, max: 9 },
      { name: "9-10", min: 9, max: 10.01 },
    ];
    return buckets.map((b) => {
      const sub = filtered.filter((d) => d.CGPA >= b.min && d.CGPA < b.max);
      const avg = sub.length ? sub.reduce((s, d) => s + d.Salary, 0) / sub.length : 0;
      return { name: b.name, value: +avg.toFixed(1) };
    });
  }, [filtered]);

  const summary = useMemo(() => {
    const avgSal = filtered.length ? (filtered.reduce((s, d) => s + d.Salary, 0) / filtered.length).toFixed(1) : "0";
    const topCompany = byCompany[0]?.name ?? "—";
    const topRole = byRole[0]?.name ?? "—";
    return { avgSal, total: filtered.length, topCompany, topRole };
  }, [filtered, byCompany, byRole]);

  const skillColors = [TEAL, "#069BB7", MINT];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-navy">Alumni Insights Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real placement intelligence from AU alumni. Filter, explore, decide.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Select label="Year" value={year} onChange={setYear} options={opts.years} />
        <Select label="Company" value={company} onChange={setCompany} options={opts.companies} />
        <Select label="Role" value={role} onChange={setRole} options={opts.roles} />
        <Select label="Skill Level" value={skill} onChange={setSkill} options={opts.skills} />
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Top Hiring Companies">
          <BarChart data={byCompany} margin={{ top: 5, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} stroke="#475569" fontSize={12} />
            <YAxis stroke="#475569" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill={TEAL} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Most In-Demand Roles">
          <BarChart data={byRole} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#475569" fontSize={12} />
            <YAxis dataKey="name" type="category" width={130} stroke="#475569" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill={MINT} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Placement Trends (2020-2024)">
          <BarChart data={byYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#475569" fontSize={12} />
            <YAxis stroke="#475569" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="On-campus" fill={TEAL} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Off-campus" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Internship Conversion Rate">
          <PieChart>
            <Pie data={internshipPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              <Cell fill={MINT} />
              <Cell fill={TEAL} />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Avg Salary by Skill Level (LPA)">
          <BarChart data={salaryBySkill}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#475569" fontSize={12} />
            <YAxis stroke="#475569" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {salaryBySkill.map((_, i) => (
                <Cell key={i} fill={skillColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        <ChartCard title="CGPA vs Salary Correlation (LPA)">
          <LineChart data={cgpaSalary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#475569" fontSize={12} />
            <YAxis stroke="#475569" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={GOLD} strokeWidth={3} dot={{ r: 5, fill: GOLD }} />
          </LineChart>
        </ChartCard>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Avg Salary", value: `₹${summary.avgSal} LPA` },
          { label: "Total Placements", value: summary.total },
          { label: "Top Company", value: summary.topCompany },
          { label: "Top Role", value: summary.topRole },
        ].map((s) => (
          <div key={s.label} className="bg-navy text-white rounded-xl p-5 border border-white/10">
            <div className="text-mint text-2xl font-extrabold">{s.value}</div>
            <div className="text-white/70 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
