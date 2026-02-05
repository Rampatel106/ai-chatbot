import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // One session per browser tab
  const sessionIdRef = useRef(
    crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input;

  setMessages((prev) => [...prev, { role: "user", text: userText }]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch(
      "https://ramkumar01234.app.n8n.cloud/webhook/ai-article-webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId: sessionIdRef.current
        })
      }
    );

    const data = await response.json();

    // 🔑 Use correct key from n8n
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.response || "No response from AI" }
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "⚠️ Error connecting to server." }
    ]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <h3 style={styles.header}>AI Chatbot</h3>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#2563eb" : "#e5e7eb",
              color: msg.role === "user" ? "#fff" : "#000"
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, background: "#e5e7eb" }}>
            Typing…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ✅ ADD THIS — styles MUST exist */
const styles = {
  container: {
    width: "100%",
    maxWidth: "420px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "10px"
  },
  chatBox: {
    height: "420px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    background: "#f9fafb"
  },
  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: "1.4"
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  }
};
