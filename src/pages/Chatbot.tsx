import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "model"; text: string };

const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Other"];
const years = ["1st", "2nd", "3rd", "4th"];

const Chatbot = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold text-navy">AI Career Guide</h1>
        <p className="text-muted-foreground mt-1">
          Tell us about you. Get data-backed guidance instantly.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <form
          onSubmit={handleStart}
          className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4 h-fit"
        >
          <h2 className="text-xl font-bold text-navy">Tell us about yourself</h2>

          <label className="block text-sm">
            <span className="font-medium text-navy">Branch</span>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mint"
            >
              {branches.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-navy">Year of study</span>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mint"
            >
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-navy">CGPA</span>
            <input
              type="number" step="0.01" min={0} max={10}
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-navy">Skills known (comma separated)</span>
            <input
              type="text"
              placeholder="e.g. Python, SQL, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </label>

          <div className="text-sm">
            <span className="font-medium text-navy">Career goal</span>
            <div className="mt-2 flex gap-4">
              {(["Get Placed", "Build a Startup"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="goal" value={g}
                    checked={goal === g}
                    onChange={() => setGoal(g)}
                    className="accent-mint"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mint text-navy font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Get Career Guidance"}
          </button>
        </form>

        {/* Chat */}
        <div className="bg-navy rounded-xl shadow-card border border-white/10 flex flex-col h-[600px] overflow-hidden">
          <div className="bg-navy-soft border-b border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-mint text-navy flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold">AU Career Compass Bot</div>
              <div className="text-xs text-mint">Online</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-white/50 text-sm text-center mt-10">
                Fill out your profile to start the conversation.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="w-7 h-7 rounded-full bg-mint text-navy flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-mint text-navy rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-mint text-navy flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-navy-soft flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={messages.length ? "Ask a follow-up…" : "Submit profile first"}
              disabled={!messages.length || loading}
              className="flex-1 bg-white/10 text-white placeholder:text-white/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mint disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || !messages.length}
              className="bg-mint text-navy p-2.5 rounded-lg hover:opacity-90 disabled:opacity-50"
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
