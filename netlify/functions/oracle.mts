import type { Context, Config } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const body = await req.json();
    const question = String(body?.question || "").slice(0, 2000);
    const profile = String(body?.profile || "").slice(0, 4000);
    if (!question) return Response.json({ error: "Question required" }, { status: 400 });

    const token = Netlify.env.get("HF_TOKEN");
    const model = Netlify.env.get("HF_MODEL") || "Qwen/Qwen3-4B-Instruct-2507";
    if (!token) return Response.json({
      answer: "ORACLE OFFLINE. No HF_TOKEN is configured yet. The local reflection engine is still available."
    });

    const system = "You are SPIRIT404, a reflective pattern-analysis assistant. Human Design and astrology are interpretive frameworks, not scientifically established mechanisms. Never present them as objective facts. Separate symbolic interpretation from observable evidence. Do not give medical, legal or financial advice. Be concise, direct, slightly cryptic but useful.";
    const user = "Profile: " + (profile || "not indexed") + "\nQuestion: " + question;
    const payload = {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 500,
      temperature: 0.7
    };

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return Response.json({ answer: "ORACLE SIGNAL LOST. Try again in a moment." }, { status: 200 });
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "No signal returned.";
    return Response.json({ answer });
  } catch {
    return Response.json({ answer: "ORACLE SIGNAL LOST. The local reflection layer remains available." }, { status: 200 });
  }
};

export const config: Config = { path: "/api/oracle" };
