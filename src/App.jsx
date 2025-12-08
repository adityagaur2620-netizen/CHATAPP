import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const WS_URL = "wss://chataap-production.up.railway.app"

  const connectWebSocket = () => {
    const ws = new WebSocket(WS_URL);

    


    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setSocket(ws);
      setJoined(true);
      // system join message
      const joinMsg = {
        type: "system",
        text: `${username} joined the chat`,
        time: new Date().toLocaleTimeString(),
      };
      ws.send(JSON.stringify(joinMsg));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch (e) {
        console.log("Invalid message", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
      setJoined(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };
  };

  const handleJoin = () => {
    if (!username.trim()) return alert("Enter your name");
    connectWebSocket();
  };

  const handleSend = () => {
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const msg = {
      type: "chat",
      username,
      text: message.trim(),
      time: new Date().toLocaleTimeString(),
    };

    socket.send(JSON.stringify(msg));
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="app">
      <div className="card">
        <h1>BaatCheet</h1>

        {!joined && (
          <div className="join-section">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleJoin}>Join</button>
          </div>
        )}

        {joined && (
          <>
            <div className="info">Logged in as <b>{username}</b></div>

            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.type === "system"
                      ? "msg system"
                      : msg.username === username
                      ? "msg own"
                      : "msg"
                  }
                >
                  {msg.type === "chat" ? (
                    <>
                      <div className="meta">
                        {msg.username} • {msg.time}
                      </div>
                      <div className="text">{msg.text}</div>
                    </>
                  ) : (
                    <div className="system-text">
                      {msg.text} ({msg.time})
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-row">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
