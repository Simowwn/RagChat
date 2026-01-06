import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});

export let vectorStore: MemoryVectorStore | null = null;

export async function createVectorStore(text: string) {
  vectorStore = await MemoryVectorStore.fromTexts(
    [text],
    [{ source: "uploaded-document" }],
    embeddings
  );
}
