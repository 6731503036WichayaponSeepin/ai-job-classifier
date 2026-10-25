
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return jsonResponse({
        project: "AI Job Category Classifier",
        status: "running"
      });
    }

    if (url.pathname === "/api/classify") {
      if (request.method !== "POST") {
        return jsonResponse(
          { error: "Method not allowed" }, 405
        );
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse(
          { error: "Invalid JSON" }, 400
        );
      }

      const description = body?.description;

      if (
        typeof description !== "string" ||
        description.trim().length < 10 ||
        description.length > 2000
      ) {
        return jsonResponse({
          error: "Description must be 10-2000 characters"
        }, 400);
      }


try {
  const result = await env.AI.run(
    "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    {
      messages: [
        {
          role: "system",
          content: `You classify job descriptions.
Choose exactly one category:
Software Development, Design, Marketing, Other.

Return ONLY valid JSON:
{"category":"Software Development","reason":"Short explanation"}

Do not include markdown or extra text.`
        },
        {
          role: "user",
          content: `Job description: ${description.trim()}`
        }
      ],
      max_tokens: 200,
      temperature: 0
    }
  );


const raw = result.response ?? result;

let decision;

if (typeof raw === "string") {
  decision = JSON.parse(raw);
} else if (raw && typeof raw === "object") {
  decision = raw;
} else {
  throw new Error("Unexpected AI response format");
}


  const allowed = [
    "Software Development",
    "Design",
    "Marketing",
    "Other"
  ];

  if (
    !allowed.includes(decision.category) ||
    typeof decision.reason !== "string" ||
    !decision.reason.trim()
  ) {
    throw new Error("Invalid AI output");
  }

  return jsonResponse({
    category: decision.category,
    reason: decision.reason,
    source: "ai"
  });

    } catch (error) {
      console.error("AI decision failed:", error.message);

      return jsonResponse({
        category: "Other",
        reason: "AI unavailable or invalid response",
        source: "fallback"
      });
    }

    } // ปิด if (url.pathname === "/api/classify")

    return jsonResponse({ error: "Not found" }, 404);
  }
};
