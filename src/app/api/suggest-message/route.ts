import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HF_API_KEY!; // add in .env.local

export async function GET() {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/togethercomputer/GPT-JT-6B-v0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const result = await response.json();

    // Hugging Face API returns an array of objects with 'generated_text'
    const text = Array.isArray(result) && result[0]?.generated_text
      ? result[0].generated_text
      : "No output from model";

    return NextResponse.json({ questions: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
