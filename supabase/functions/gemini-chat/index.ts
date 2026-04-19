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
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), {
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

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Gemini error:", resp.status, t);
      return new Response(JSON.stringify({ error: `Gemini API error (${resp.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ??
      "Sorry, I couldn't generate a response.";

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
