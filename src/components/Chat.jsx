import { useState, useRef } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const sessionIdRef = useRef(Date.now().toString());

  const sendMessage = async () => {
    if (!input.trim()) return;

    // user message show
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    try {
      const res = await fetch(
        "https://ramkumar01234.app.n8n.cloud/webhook/ai-article-webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            sessionId: sessionIdRef.current,
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.article || "AI se response nahi mila",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Server error, baad me try karo" },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>AI Chatbot</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
