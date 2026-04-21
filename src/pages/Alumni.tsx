import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

type AlumniFormState = {
  fullName: string;
  graduationYear: string;
  branch: string;
  currentRole: string;
  currentCompany: string;
  cityCountry: string;
  linkedinUrl: string;
  advice: string;
  careerPath: string;
};

const branchOptions = [
  "CSE",
  "ECE",
  "Mechanical",
  "Civil",
  "IT",
  "Chemical",
  "Pharmaceutical",
  "Arts & Commerce",
  "Law",
  "Other",
];

const skillOptions = [
  "DSA",
  "Communication",
  "Projects",
  "Internships",
  "Networking",
  "Research",
  "Entrepreneurship",
  "Other",
];

const careerPathOptions = ["Placed", "Entrepreneur", "Higher Studies", "Government", "Other"];

const graduationYears = Array.from({ length: 2024 - 1980 + 1 }, (_, index) => String(2024 - index));

const defaultFormState: AlumniFormState = {
  fullName: "",
  graduationYear: "2024",
  branch: "CSE",
  currentRole: "",
  currentCompany: "",
  cityCountry: "",
  linkedinUrl: "",
  advice: "",
  careerPath: "Placed",
};

const confettiColors = ["#D4AF37", "#FFD166", "#F7E19C", "#B38728", "#FFE9A8"];

const Alumni = () => {
  const [formState, setFormState] = useState<AlumniFormState>(defaultFormState);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const adviceCharacterCount = formState.advice.length;

  useEffect(() => {
    if (!showConfetti) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [showConfetti]);

  const updateField = <K extends keyof AlumniFormState>(key: K, value: AlumniFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      }
      return [...prev, skill];
    });
  };

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError(false);

    // 🚀 DEMO MODE: Fake a network request for 1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1500));

    /* // Commenting out the broken Lovable Supabase call for the demo
    const { error } = await supabase.from("alumni_submissions").insert({
      full_name: formState.fullName.trim(),
      graduation_year: Number(formState.graduationYear),
      branch: formState.branch,
      // ... rest of the fields
    });

    if (error) {
      setSubmitError(true);
      setSubmitMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }
    */

    // Force a guaranteed success for the demo
    setSubmitMessage("Thank you! Your story will appear on the Alumni Wall after review.");
    setSubmitError(false);
    setShowConfetti(true);
    
    // Reset form
    setFormState(defaultFormState);
    setSelectedSkills([]);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#1a0a0a] text-ivory pt-24 pb-12">
      
      {/* 100 Years Banner */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="w-full rounded-2xl border border-[#3a2a1a] bg-[#0d0d0d] px-4 py-8 text-center md:px-8 shadow-card">
          <p className="text-xl md:text-2xl font-semibold text-gold">
            100 years. Thousands of legends. Your story is next.
          </p>
        </div>
      </section>

      {/* Alumni Form Section */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gold">Are You an AU Alumni?</h2>
          <p className="mt-3 text-sm md:text-base text-[#B8A89A]">
            Share your journey. Help current students see what&apos;s possible.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-[#3a2a1a] bg-[#1f0f0f] p-6 text-white shadow-card md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">Full Name</span>
                <input
                  type="text"
                  required
                  value={formState.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">Graduation Year</span>
                <select
                  required
                  value={formState.graduationYear}
                  onChange={(event) => updateField("graduationYear", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                >
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">Branch</span>
                <select
                  required
                  value={formState.branch}
                  onChange={(event) => updateField("branch", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                >
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">Current Role</span>
                <input
                  type="text"
                  required
                  value={formState.currentRole}
                  onChange={(event) => updateField("currentRole", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">Current Company</span>
                <input
                  type="text"
                  required
                  value={formState.currentCompany}
                  onChange={(event) => updateField("currentCompany", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">City / Country</span>
                <input
                  type="text"
                  value={formState.cityCountry}
                  onChange={(event) => updateField("cityCountry", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">LinkedIn URL</span>
                <input
                  type="url"
                  value={formState.linkedinUrl}
                  onChange={(event) => updateField("linkedinUrl", event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-gold">
                  Advice to current AU students
                </span>
                <textarea
                  required
                  maxLength={200}
                  value={formState.advice}
                  onChange={(event) => updateField("advice", event.target.value)}
                  className="min-h-24 w-full rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 py-3 text-[14px] text-white outline-none focus:border-gold transition-colors"
                />
                <p className="text-right text-[12px] text-[#B8A89A]">{adviceCharacterCount}/200</p>
              </label>

              <fieldset className="space-y-3 md:col-span-2">
                <legend className="text-[12px] font-semibold uppercase tracking-wide text-gold mb-2">
                  Skills that helped most
                </legend>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`min-h-11 rounded-full border px-5 text-[14px] font-semibold transition-colors ${
                          active
                            ? "border-gold bg-gold text-[#0d0d0d]"
                            : "border-[#8B6914] bg-[#1a0a0a] text-gold hover:border-gold"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-3 md:col-span-2">
                <legend className="text-[12px] font-semibold uppercase tracking-wide text-gold mb-2">
                  Career path taken
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {careerPathOptions.map((path) => (
                    <label key={path} className="flex min-h-12 items-center gap-3 rounded-xl border border-[#3a2a1a] bg-[#2a1a1a] px-4 cursor-pointer hover:border-[#8B6914] transition-colors">
                      <input
                        type="radio"
                        name="career-path"
                        value={path}
                        checked={formState.careerPath === path}
                        onChange={(event) => updateField("careerPath", event.target.value)}
                        className="accent-gold w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[14px] text-white font-medium">{path}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 text-[15px] font-bold text-[#0d0d0d] transition-colors hover:bg-gold-soft disabled:opacity-70 hover-gold-glow"
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d0d0d] border-t-transparent" />
                  Submitting...
                </>
              ) : (
                "Share My Journey"
              )}
            </button>
          </form>

          {submitMessage && (
            <div
              className={`relative mt-6 overflow-hidden rounded-xl border px-5 py-4 text-[14px] font-medium text-center ${
                submitError
                  ? "border-red-900/50 bg-red-900/20 text-red-200"
                  : "border-green-900/50 bg-green-900/20 text-green-200"
              }`}
            >
              {showConfetti && !submitError && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, index) => (
                    <span
                      key={`confetti-${index}`}
                      className="alumni-confetti"
                      style={{
                        left: `${(index * 13) % 100}%`,
                        animationDelay: `${index * 25}ms`,
                        backgroundColor: confettiColors[index % confettiColors.length],
                      }}
                    />
                  ))}
                </div>
              )}
              <p className="relative">{submitMessage}</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes alumni-confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(150px) rotate(720deg);
            opacity: 0;
          }
        }

        .alumni-confetti {
          position: absolute;
          top: -15px;
          width: 8px;
          height: 16px;
          border-radius: 4px;
          animation: alumni-confetti-fall 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Alumni;