"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; content: string }[]>(
    []
  );
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/upload", { method: "POST", body: fd });
      setReady(true);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const userMessage = message;
      setChat([...chat, { role: "user", content: userMessage }]);
      setMessage("");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "ai", content: data.answer }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <main className="w-full max-w-2xl mx-auto flex flex-col p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            📄 RAG Document Chat
          </h1>
          <p className="text-slate-400">
            Upload a document and ask questions about it
          </p>
        </div>

        {!ready ? (
          /* Upload Section */
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-slate-700 rounded-lg p-8 w-full max-w-md border border-slate-600">
              <label className="block mb-4">
                <span className="text-white font-semibold mb-2 block">
                  Select Document
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-slate-500 rounded-lg bg-slate-600 text-white file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </label>
              {file && (
                <p className="text-sm text-slate-300 mb-4">
                  Selected: {file.name}
                </p>
              )}
              <button
                onClick={upload}
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? "Processing..." : "Process Document"}
              </button>
            </div>
          </div>
        ) : (
          /* Chat Section */
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 bg-slate-700 rounded-lg p-4 border border-slate-600 space-y-3">
              {chat.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Start asking questions about your document...
                </p>
              ) : (
                chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-slate-600 text-slate-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-600 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
