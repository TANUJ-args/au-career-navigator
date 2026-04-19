const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are AU Career Compass, an AI career guidance assistant for Andhra University students. You have access to alumni placement data from 3000 AU alumni.

Based on the student's profile, provide:
1. Placement Readiness Assessment — where they currently stand
2. Company Matches — which companies match their profile based on AU alumni data (be specific with company names from: Amazon, Google, TCS, Capgemini, Wipro, Deloitte, Microsoft, IBM, Accenture, Infosys, Flipkart)
3. Skill Gap Analysis — exactly what skills they need to reach their target
4. Campus Resource Routing — direct them to the right AU campus resource:
   - AHub if they want a startup (90+ startups, ₹62.7Cr funding)
   - NASSCOM CoE for IoT/AI skills (on AU campus, ₹131Cr ecosystem)
   - AU Skill Development Centre for industry tools
   - Codeium (AU coding club) for DSA and coding practice
   - TheDigifac for low-code/no-code opportunities
5. Action Plan — 3 concrete next steps

Be specific, encouraging, and data-backed. Reference actual AU alumni outcomes where relevant. Keep response under 300 words. Use clear markdown headings.`;

type Msg = { role: "user" | "model"; text: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = (await req.json()) as { messages: Msg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.text,
      })),
    ];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: chatMessages,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: `AI error (${resp.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const reply: string =
      data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gemini-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
