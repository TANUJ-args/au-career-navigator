import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ── Types ────────────────────────────────────────────────
interface Message {
  role: "bot" | "user";
  content: string;
  isForm?: boolean;
  formSubmitted?: boolean;
}

interface StudentProfile {
  branch: string;
  year: string;
  cgpa: string;
  skills: string;
  goal: "placed" | "startup";
}

// Backend expects this exact structure
type ApiMsg = { role: "user" | "model"; text: string };

// ── Constants ────────────────────────────────────────────
const BRANCHES = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Chemical", "Other"];
const YEARS = ["1st", "2nd", "3rd", "4th"];

const SYSTEM_PROMPT = `You are AU Career Navigator — an AI career mentor built specifically for Andhra University students. You are powered by CPDC (Career Planning & Development Centre) data and 3000 AU alumni records.

ABOUT ANDHRA UNIVERSITY:
- Established 1926, Visakhapatnam, AP
- 425 acre campus, NAAC A++ grade score 3.74
- NIRF Innovation Ranking Band 11-50
- 305+ affiliated colleges, 58 departments

ABOUT CPDC:
Career Planning & Development Centre — Empowering Futures • Inspiring Innovation • Building Entrepreneurs
Email: cpdc@andhrauniversity.edu.in | Dean: Prof. Vazeer Mahammood
5 Pillars: Training & Placements, Skill Development, Innovation (IIC), Incubation (ā Hub/AUIC), Industry Connect

ALUMNI PLACEMENT DATA (3000 records):
Companies: Capgemini (301), Accenture (293), Deloitte (281), Amazon (276), IBM (272), Google (269), TCS (266), Flipkart (266), Infosys (263), Microsoft (258), Wipro (256)
Average Salary: ₹14.5 LPA overall
KEY INSIGHT: Skill level matters far more than CGPA for salary.

STRICT RESPONSE RULES:
- First response: MAX 5 lines covering readiness, company match, skill gap, next step, roadmap link
- ALL responses: MAX 5 lines unless user says "tell me more", "explain", or "details"
- Sound like a smart senior, not a robot
- Always end short responses with ONE follow-up question
- Always mention ONE specific AU/CPDC resource relevant to their gap`;

// ── Inline Profile Form Component ────────────────────────
function InlineProfileForm({
  onSubmit,
  submitted,
}: {
  onSubmit: (profile: StudentProfile) => void;
  submitted: boolean;
}) {
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("3rd");
  const [cgpa, setCgpa] = useState("8.0");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState<"placed" | "startup">("placed");

  if (submitted) {
    return (
      <p className="text-xs text-amber-400/70 italic mt-1">
        Profile submitted ✓ — see guidance below
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-amber-400/80 mb-1">Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full h-8 text-[12px] bg-[#2a1a1a] border border-amber-900/40 rounded px-2 text-white focus:outline-none focus:border-amber-500"
          >
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-amber-400/80 mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full h-8 text-[12px] bg-[#2a1a1a] border border-amber-900/40 rounded px-2 text-white focus:outline-none focus:border-amber-500"
          >
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-amber-400/80 mb-1">CGPA</label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          className="w-full h-8 text-[12px] bg-[#2a1a1a] border border-amber-900/40 rounded px-2 text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-[11px] text-amber-400/80 mb-1">
          Skills you know (comma separated)
        </label>
        <input
          type="text"
          placeholder="Python, DSA, React..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full h-8 text-[12px] bg-[#2a1a1a] border border-amber-900/40 rounded px-2 text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-[11px] text-amber-400/80 mb-1">Career goal</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGoal("placed")}
            className={`flex-1 h-8 text-[12px] rounded border transition-all ${
              goal === "placed"
                ? "bg-amber-500 border-amber-500 text-black font-semibold"
                : "bg-transparent border-amber-900/40 text-white/70"
            }`}
          >
            💼 Get Placed
          </button>
          <button
            type="button"
            onClick={() => setGoal("startup")}
            className={`flex-1 h-8 text-[12px] rounded border transition-all ${
              goal === "startup"
                ? "bg-amber-500 border-amber-500 text-black font-semibold"
                : "bg-transparent border-amber-900/40 text-white/70"
            }`}
          >
            🚀 Build Startup
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmit({ branch, year, cgpa, skills, goal })}
        className="w-full h-9 text-[13px] font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded transition-all mt-1"
      >
        Get My Guidance →
      </button>
    </div>
  );
}

// ── Typing Indicator ─────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-amber-400" />
      </div>
      <div className="bg-[#1f0f0f] border border-amber-900/30 rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ── Main Chatbot Component ───────────────────────────────
export default function Chatbot() {
  // UI Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hey! 👋 I'm your AU Career Mentor.\nTell me about yourself and I'll give you personalized guidance based on real AU alumni data.",
      isForm: true,
      formSubmitted: false,
    },
  ]);
  
  // Backend History (keeps the exact format the working API expects)
  const [apiHistory, setApiHistory] = useState<ApiMsg[]>([]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileSubmitted, setProfileSubmitted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Call Gemini via Supabase (Using the OLD Working Payload) ──
  const sendToGemini = async (history: ApiMsg[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { messages: history }, // EXACT format that worked before
      });
      
      if (error) throw error;
      
      const reply = data?.reply ?? "I couldn't get a response. Please try again.";
      
      // Update UI with bot response
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
      // Update API history
      setApiHistory([...history, { role: "model", text: reply }]);
      
    } catch (e: any) {
      console.error("Supabase Error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `⚠️ ${e?.message ?? "Something went wrong connecting to the AI."}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Profile Form Submit ──────────────────────────
  const handleProfileSubmit = async (profile: StudentProfile) => {
    // Mark form as submitted in UI
    setMessages((prev) =>
      prev.map((m, i) => (i === 0 ? { ...m, formSubmitted: true } : m))
    );
    setProfileSubmitted(true);

    // Text shown to user
    const userText = `My profile: Branch: ${profile.branch}, Year: ${profile.year}, CGPA: ${profile.cgpa}, Skills: ${profile.skills || "none listed yet"}, Goal: ${profile.goal === "placed" ? "Get Placed" : "Build a Startup"}`;
    
    // Text sent to backend (sneaking the SYSTEM PROMPT in so it works with the old API)
    const backendText = `SYSTEM RULES:\n${SYSTEM_PROMPT}\n\nUSER PROFILE:\n${userText}\n\nPlease give me my Placement Readiness Assessment, Company Matches, Skill Gap Analysis, Campus Resource Routing, and a 3-step Action Plan.`;

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    
    // Prepare backend history
    const nextApiHistory: ApiMsg[] = [{ role: "user", text: backendText }];
    setApiHistory(nextApiHistory);
    
    // Send to backend
    await sendToGemini(nextApiHistory);
  };

  // ── Handle Follow-up Chat ───────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || !profileSubmitted || loading) return;

    setInput("");
    
    // Update UI
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    
    // Prepare backend history
    const nextApiHistory: ApiMsg[] = [...apiHistory, { role: "user", text }];
    setApiHistory(nextApiHistory);
    
    // Send to backend
    await sendToGemini(nextApiHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Page Header */}
      <div className="px-4 pt-8 pb-4 max-w-4xl mx-auto w-full">
        <p className="text-xs text-amber-500/70 tracking-widest uppercase mb-1">
          AI GUIDANCE
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
          AI Career Mentor
        </h1>
        <p className="text-sm text-white/50">
          Powered by 3,000+ AU alumni outcomes and CPDC's placement
          intelligence — your personal career advisor, available 24/7.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pb-4">
        <div className="flex-1 flex flex-col bg-[#110808] border border-amber-900/20 rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-900/20 bg-[#1a0a0a]">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Bot size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AU Career Mentor</p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-[400px] max-h-[60vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 mb-4 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "bot"
                      ? "bg-amber-500/20"
                      : "bg-amber-600/30"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <Bot size={14} className="text-amber-400" />
                  ) : (
                    <User size={14} className="text-amber-300" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "bot"
                      ? "bg-[#1f0f0f] border border-amber-900/30 rounded-tl-none text-white"
                      : "bg-amber-600/20 border border-amber-600/30 rounded-tr-none text-white"
                  }`}
                >
                  {/* Bot message with markdown */}
                  {msg.role === "bot" && !msg.isForm && (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-amber-400 prose-headings:font-bold prose-strong:text-white prose-a:text-amber-400">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* First bot message with inline form */}
                  {msg.isForm && (
                    <>
                      <p className="text-sm text-white whitespace-pre-line">
                        {msg.content}
                      </p>
                      <InlineProfileForm
                        onSubmit={handleProfileSubmit}
                        submitted={msg.formSubmitted ?? false}
                      />
                    </>
                  )}

                  {/* User message */}
                  {msg.role === "user" && (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  
                  {/* Roadmap link styling */}
                  {msg.role === "bot" && !msg.isForm && msg.content.includes("roadmap.sh") && (
                     <a
                       href={`https://${msg.content.match(/roadmap\.sh\/[a-z-]+/)?.[0] ?? "roadmap.sh"}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="mt-3 inline-flex items-center gap-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full transition-all no-underline"
                     >
                       Follow Your Roadmap →
                     </a>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="px-4 py-3 border-t border-amber-900/20 bg-[#1a0a0a]">
            {!profileSubmitted ? (
              <p className="text-center text-xs text-white/30 py-1">
                Fill out your profile above to start the conversation
              </p>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a follow up question..."
                  disabled={loading}
                  className="flex-1 h-11 bg-[#2a1a1a] border border-amber-900/30 rounded-xl px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                  style={{ fontSize: "16px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Send size={16} className="text-black" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}