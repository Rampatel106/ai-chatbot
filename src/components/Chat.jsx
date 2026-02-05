import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { from: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://ramkumar01234.app.n8n.cloud/webhook/ai-article-webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatInput: userMsg.text, // ✅ n8n ko sahi input
          }),
        }
      );

      const data = await res.json();

      const botMsg = {
        from: "bot",
        text: data.article || "No response from AI", // ✅ sahi field
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server error, thodi der baad try karo" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>AI Chatbot</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
          background: "#f9f9f9",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.from === "user" ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 6,
                background: m.from === "user" ? "#DCF8C6" : "#ffffff",
                color: "#000",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div>Typing...</div>}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        style={{ width: "80%", padding: 6 }}
      />
      <button onClick={sendMessage} style={{ padding: 6 }}>
        Send
      </button>
    </div>
  );
}

export default Chat;
