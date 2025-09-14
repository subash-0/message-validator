// app/api/chat/route.ts
import { NextResponse } from "next/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY; // change if your env var has a different name

export async function GET() {
  try {
    if (!OPENROUTER_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY env var" }, { status: 500 });
    }

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    // Important: system message forces "chat-style" reply and blocks chain-of-thought.
    const requestBody = {
      model: "nvidia/nemotron-nano-9b-v2:free",
      messages: [
        {
          role: "system",
          content: "You are a concise assistant. DO NOT produce chain-of-thought, internal reasoning, or any field named 'reasoning_details'. Only respond with the requested output: a single string containing three questions separated by '||' and nothing else."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.0,
      max_new_tokens: 120
    };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `OpenRouter error: ${res.status}`, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Extract the assistant reply robustly from common shapes returned by such APIs.
    let assistantText: string | null = null;
    if (Array.isArray(data?.choices) && data.choices.length > 0) {
      const choice = data.choices[0];
      // usual structure: choice.message.content
      if (choice?.message) {
        assistantText = typeof choice.message === "string" ? choice.message : (choice.message.content ?? null);
      }
      // other fallbacks
      assistantText = assistantText ?? choice?.text ?? choice?.delta?.content ?? null;
    }

    // final fallback: some APIs put the text in data.output or data.output_text
    assistantText = assistantText ?? data?.output?.[0]?.content ?? data?.output_text ?? null;

    // ensure string type
    if (Array.isArray(assistantText)) assistantText = assistantText.join("");

    return NextResponse.json({ message: assistantText });
  } catch (err) {
     return Response.json(
      {
        success: false,
        message: `Error while fetching messages ! ${err}`,
        },
      { status: 404 }
    );
  }
}
