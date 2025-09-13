import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/Supabase";
import { useAuth } from "../context/AuthContext";

export default function UserMessages({ adminId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("/default-avatar.png");
  const messagesEndRef = useRef();

  // Scroll to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages
  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*, user:user_id (full_name, avatar_url)")
      .or(
        `(user_id.eq.${user.id},id.eq.${adminId}),(user_id.eq.${adminId},id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    if (!error) setMessages(data);
  };

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", adminId)
      .single();
    if (!error && data) setAdminAvatar(data.avatar_url || "/default-avatar.png");
  };

  useEffect(() => {
    fetchMessages();
    fetchAdminProfile();

    const subscription = supabase
      .channel("user-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new;
          if (
            (m.user_id === user?.id && m.id === adminId) ||
            (m.user_id === adminId && m.id === user?.id)
          ) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase
      .from("messages")
      .insert([{ user_id: user.id, id: adminId, content: newMessage.trim() }]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh", border: "1px solid #ccc", overflowX:'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", backgroundColor: "#f9f9f9" }}>
        {messages.map((m) => {
          const isUser = m.user_id === user.id;
          const avatar = isUser ? user?.avatar_url || "/default-avatar.png" : adminAvatar;
          return (
            <div
              key={m.message_id}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              {!isUser && <img src={avatar} alt="admin" style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 8 }} />}
              <span
                style={{
                  backgroundColor: isUser ? "#cfe2ff" : "#e2e3e5",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                }}
              >
                {m.content}
              </span>
              {isUser && <img src={avatar} alt="user" style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 8 }} />}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div style={{ display: "flex", borderTop: "1px solid #ddd", padding: "10px", backgroundColor: "#fff" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc", marginRight: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", borderRadius: "20px", backgroundColor: "#0d6efd", color: "#fff", border: "none" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
