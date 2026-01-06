import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});

let vectorStore: Chroma | null = null;

export async function createVectorStore(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);

  vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "documents",
  });
}

export async function getVectorStore() {
  return vectorStore;
}
