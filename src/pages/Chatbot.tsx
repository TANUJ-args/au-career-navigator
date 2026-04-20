import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "model"; text: string };

const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Other"];
const years = ["1st", "2nd", "3rd", "4th"];

const Chatbot = () => {
  const [searchParams] = useSearchParams();
  const [branch, setBranch] = useState("CSE");
  const [yearOfStudy, setYearOfStudy] = useState("3rd");
  const [cgpa, setCgpa] = useState("8.0");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState<"Get Placed" | "Build a Startup">("Get Placed");

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const prefilledSkills = searchParams.get("skills");
    const prefilledGoal = searchParams.get("goal");
    const prefilledRole = searchParams.get("role");

    if (prefilledSkills) {
      setSkills(prefilledSkills);
    }

    if (prefilledGoal === "Get Placed" || prefilledGoal === "Build a Startup") {
      setGoal(prefilledGoal);
    }

    if (prefilledRole) {
      setInput(`I want to target ${prefilledRole}. Please create a role-focused preparation plan for me.`);
    }
  }, [searchParams]);

  const sendToGemini = async (history: Msg[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { messages: history },
      });
      if (error) throw error;
      const reply: string = data?.reply ?? "Sorry, no response.";
      setMessages((m) => [...m, { role: "model", text: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "model", text: `⚠️ ${e?.message ?? "Failed to reach the AI."}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const profile =
      `Student profile:\n` +
      `- Branch: ${branch}\n` +
      `- Year of study: ${yearOfStudy}\n` +
      `- CGPA: ${cgpa}\n` +
      `- Skills: ${skills || "(none listed)"}\n` +
      `- Career goal: ${goal}\n\n` +
      `Please give me my Placement Readiness Assessment, Company Matches, Skill Gap Analysis, Campus Resource Routing, and a 3-step Action Plan.`;
    const next: Msg[] = [{ role: "user", text: profile }];
    setMessages(next);
    sendToGemini(next);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", text: input.trim() }];
    setMessages(next);
    setInput("");
    sendToGemini(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-gold font-semibold uppercase tracking-[0.18em] text-xs md:text-sm">AI Guidance</p>
        <h1 className="text-3xl md:text-5xl text-maroon dark:text-ivory mt-2">AI Career Mentor</h1>
        <p className="text-muted-foreground mt-1">
          Share your current profile and get a focused action plan backed by AU outcomes.
        </p>

        {searchParams.get("role") && (
          <p className="mt-3 inline-flex rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs font-semibold text-maroon dark:text-gold">
            Path handoff loaded for role: {searchParams.get("role")}
          </p>
        )}
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <form
          onSubmit={handleStart}
          className="glass rounded-2xl p-6 shadow-card border border-gold/20 space-y-4 h-fit"
        >
          <h2 className="text-2xl text-maroon dark:text-ivory">Tell us about yourself</h2>

          <label className="block text-sm">
            <span className="font-medium text-maroon dark:text-ivory">Branch</span>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-1 w-full border border-gold/25 rounded-xl px-3 py-2 bg-card/70 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {branches.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-maroon dark:text-ivory">Year of study</span>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="mt-1 w-full border border-gold/25 rounded-xl px-3 py-2 bg-card/70 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-maroon dark:text-ivory">CGPA</span>
            <input
              type="number" step="0.01" min={0} max={10}
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="mt-1 w-full border border-gold/25 rounded-xl px-3 py-2 bg-card/70 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-maroon dark:text-ivory">Skills known (comma separated)</span>
            <input
              type="text"
              placeholder="e.g. Python, SQL, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 w-full border border-gold/25 rounded-xl px-3 py-2 bg-card/70 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>

          <div className="text-sm">
            <span className="font-medium text-maroon dark:text-ivory">Career goal</span>
            <div className="mt-2 flex gap-4">
              {(["Get Placed", "Build a Startup"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="goal" value={g}
                    checked={goal === g}
                    onChange={() => setGoal(g)}
                    className="accent-gold"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-maroon font-semibold py-3 rounded-xl hover:bg-gold-soft transition disabled:opacity-50 hover-gold-glow"
          >
            {loading ? "Thinking…" : "Get Career Guidance"}
          </button>
        </form>

        {/* Chat */}
        <div className="rounded-2xl shadow-card border border-gold/20 flex flex-col h-[600px] overflow-hidden bg-maroon dark:bg-charcoal">
          <div className="border-b border-gold/25 p-4 flex items-center gap-3 bg-black/15">
            <div className="w-9 h-9 rounded-full bg-gold text-maroon flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-ivory font-semibold">AU Career Mentor</div>
              <div className="text-xs text-gold">Online</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-ivory/55 text-sm text-center mt-10">
                Fill out your profile to start the conversation.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="w-7 h-7 rounded-full bg-gold text-maroon flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-gold text-maroon rounded-br-sm whitespace-pre-wrap"
                      : "bg-white/10 text-ivory rounded-bl-sm prose prose-sm prose-invert max-w-none prose-headings:text-gold prose-headings:font-bold prose-strong:text-ivory prose-strong:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-h1:text-base prose-h2:text-base prose-h3:text-sm"
                  }`}
                >
                  {m.role === "model" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-ivory/20 text-ivory flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gold text-maroon flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/10 text-ivory px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gold/25 bg-black/15 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={messages.length ? "Ask a follow-up…" : "Submit profile first"}
              disabled={!messages.length || loading}
              className="flex-1 bg-white/10 text-ivory placeholder:text-ivory/45 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || !messages.length}
              className="bg-gold text-maroon p-2.5 rounded-xl hover:bg-gold-soft disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
