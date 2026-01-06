import { NextResponse } from "next/server";
import { vectorStore } from "@/lib/rag";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!vectorStore) {
    return NextResponse.json(
      { error: "No document uploaded" },
      { status: 400 }
    );
  }

  const docs = await vectorStore.similaritySearch(message, 3);
  const context = docs.map((d) => d.pageContent).join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a document-based assistant.
ONLY answer using the provided document context.
If the answer is not in the document, say:
"The answer is not found in the provided document."
        `,
      },
      {
        role: "user",
        content: `
Document:
${context}

Question:
${message}
        `,
      },
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0].message.content,
  });
}
