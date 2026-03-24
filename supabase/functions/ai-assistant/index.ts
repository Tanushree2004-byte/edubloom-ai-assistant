import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const HF_TOKEN = Deno.env.get("HUGGINGFACE_API_TOKEN");
    if (!HF_TOKEN) throw new Error("HUGGINGFACE_API_TOKEN not configured");

    let prompt = "";
    
    if (mode === "summarize") {
      const text = messages[messages.length - 1]?.content || "";
      prompt = `Summarize the following text concisely, highlighting the key points:\n\n${text}`;
    } else if (mode === "questions") {
      const topic = messages[messages.length - 1]?.content || "";
      prompt = `Generate 5 practice questions with answers for the topic: ${topic}. Format each as "Q: question\\nA: answer" separated by blank lines.`;
    } else {
      // Chat mode - build conversational context
      const history = messages.map((m: { role: string; content: string }) => 
        `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`
      ).join("\n");
      prompt = `You are EduBloom AI, a friendly and knowledgeable academic tutor. Give clear, concise explanations. Use examples when helpful.\n\n${history}\nTutor:`;
    }

    // Use Hugging Face Inference API with a capable free model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      
      if (response.status === 503) {
        return new Response(
          JSON.stringify({ error: "Model is loading, please try again in a few seconds.", loading: true }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedText = Array.isArray(data) 
      ? data[0]?.generated_text || "I couldn't generate a response. Please try again."
      : data?.generated_text || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: generatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Edge function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
