// EduBloom AI Study Assistant - Edge Function v2
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];
    const mode = body.mode || "chat";
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      console.error("LOVABLE_API_KEY missing");
      return new Response(
        JSON.stringify({ error: "AI service not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt: string;

    if (mode === "summarize") {
      systemPrompt = "You are a study assistant. Summarize the given text concisely with bullet points highlighting key points.";
    } else if (mode === "questions") {
      systemPrompt = "You are a study assistant. Generate exactly 5 practice questions with answers for the given topic. Use format: Q1: [question]\\nA1: [answer]";
    } else {
      systemPrompt = "You are EduBloom AI, a friendly academic tutor. Give clear, concise explanations with examples. Keep responses educational and helpful.";
    }

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    console.log("v2 calling gateway, mode:", mode, "msgs:", chatMessages.length);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: chatMessages,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Gateway err:", res.status, txt);
      const status = res.status === 429 || res.status === 402 ? res.status : 500;
      const msg = res.status === 429
        ? "Rate limit reached. Please wait a moment."
        : res.status === 402
        ? "AI credits exhausted."
        : "AI service error. Please try again.";
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "No response generated.";
    console.log("v2 success, length:", content.length);

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("v2 error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
