import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

// ── Sidebar (matches existing pharmacy pages) ─────────────────────────────────
function Sidebar({ user, onLogout, navigate }) {
  const NAV = [
    { key: "dashboard", label: "Dashboard",  path: "/pharmacy/dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { key: "orders",    label: "Orders",     path: "/pharmacy/orders",    icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
    { key: "products",  label: "Products",   path: "/pharmacy/products",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> },
    { key: "chat",      label: "Messages",   path: "/pharmacy/chat",      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg> },
    { key: "profile",   label: "Profile",    path: "/pharmacy/profile",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  ];
  const active = "chat";
  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "P"}</div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p>
            <p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md", online = false }) {
  const sizes = { sm: "w-8 h-8 text-[11px]", md: "w-10 h-10 text-[13px]", lg: "w-12 h-12 text-[15px]" };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black`}>
        {name?.[0]?.toUpperCase() || "?"}
      </div>
      {online && <span className={`absolute -bottom-0.5 -right-0.5 ${dotSizes[size]} bg-green-400 rounded-full border-2 border-white`}/>}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }) {
  const time = new Date(msg.createdAt).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {msg.image && (
          <div className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${isMine ? "rounded-br-sm" : "rounded-bl-sm"}`}>
            <img
              src={msg.image.startsWith("http") ? msg.image : `http://localhost:3000/uploads/${msg.image}`}
              alt="attachment"
              className="max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition"
              onClick={() => window.open(msg.image.startsWith("http") ? msg.image : `http://localhost:3000/uploads/${msg.image}`, "_blank")}
            />
          </div>
        )}
        {msg.text && (
          <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm
            ${isMine ? "bg-gray-900 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"}`}>
            {msg.text}
          </div>
        )}
        <span className="text-[10px] text-gray-400 px-1">{time}</span>
      </div>
    </div>
  );
}

// ── Main Pharmacy Chat Page ───────────────────────────────────────────────────
export default function PharmacyChatPage() {
  const navigate = useNavigate();
  const [user, setUser]             = useState(null);
  const [chatUsers, setChatUsers]   = useState([]);
  const [selected, setSelected]     = useState(null);
  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [onlineUsers, setOnlineUsers]   = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMsgs,  setLoadingMsgs]  = useState(false);
  const [sending, setSending]       = useState(false);
  const [search, setSearch]         = useState("");
  const [toast, setToast]           = useState(null);

  const socketRef    = useRef(null);
  const bottomRef    = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);

    const socket = io("http://localhost:3000", {
      query: { userId: stored._id },
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.emit("joinUserRoom", stored._id);
    socket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));
    socket.on("newMessage", (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
    });

    return () => {
      socket.emit("leaveUserRoom", stored._id);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingUsers(true);
    api.get("/chat/users")
      .then(r => setChatUsers(r.data?.users || []))
      .catch(() => setChatUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    setLoadingMsgs(true);
    setMessages([]);
    api.get(`/chat/messages/${selected._id}`)
      .then(r => setMessages(r.data?.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !imageFile) || !selected || sending) return;
    setSending(true);
    try {
      const fd = new FormData();
      if (text.trim()) fd.append("text", text.trim());
      if (imageFile)   fd.append("image", imageFile);
      const r = await api.post(`/chat/send/${selected._id}`, fd);
      const newMsg = r.data?.message;
      if (newMsg) setMessages(prev => prev.some(m => m._id === newMsg._id) ? prev : [...prev, newMsg]);
      setText("");
      setImageFile(null);
      setImagePreview(null);
      setChatUsers(prev => prev.map(u =>
        u._id === selected._id ? { ...u, lastMessage: text.trim() || "📷 Image", hasConversation: true } : u
      ));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send message", "error");
    } finally {
      setSending(false);
    }
  }, [text, imageFile, selected, sending]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const filteredUsers = chatUsers.filter(u =>
    !search.trim() ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (id) => onlineUsers.includes(id?.toString());

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      <Sidebar user={user} onLogout={logout} navigate={navigate}/>

      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen flex flex-col">
          <div className="mb-5">
            <h1 className="text-[26px] font-black text-gray-900 tracking-tight">Messages</h1>
            <p className="text-gray-400 text-[13px] mt-0.5">Chat with your customers about orders and medicines</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-1" style={{ height: "calc(100vh - 190px)", minHeight: "500px" }}>

            {/* User list */}
            <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
              <div className="p-3.5 border-b border-gray-100">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-gray-50 transition"/>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingUsers ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"/>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-gray-100 rounded w-2/3"/>
                          <div className="h-2.5 bg-gray-100 rounded w-1/2"/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-3xl mb-2">👤</div>
                    <p className="text-[13px] font-bold text-gray-600">No customers yet</p>
                    <p className="text-[11px] text-gray-400 mt-1">Customers will appear here when they message you</p>
                  </div>
                ) : (
                  filteredUsers.map(u => {
                    const online = isOnline(u._id);
                    const isSelected = selected?._id === u._id;
                    return (
                      <button key={u._id} onClick={() => setSelected(u)}
                        className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all border-b border-gray-50 last:border-0
                          ${isSelected ? "bg-green-50 border-l-2 border-l-green-500" : "hover:bg-gray-50/70 border-l-2 border-l-transparent"}`}>
                        <Avatar name={u.name} size="md" online={online}/>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-[13px] font-bold truncate ${isSelected ? "text-green-700" : "text-gray-800"}`}>{u.name}</p>
                            {online && <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Online</span>}
                          </div>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">{u.lastMessage || "No messages yet"}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat window */}
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
                </div>
                <h3 className="text-[16px] font-black text-gray-800 mb-1">Select a customer</h3>
                <p className="text-[13px] text-gray-400 max-w-xs">Choose a customer from the list to view and reply to their messages.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <Avatar name={selected.name} size="md" online={isOnline(selected._id)}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-black text-gray-900">{selected.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {isOnline(selected._id)
                        ? <span className="text-green-500 font-semibold">● Online</span>
                        : <span>Customer · {selected.email}</span>}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/40">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-7 h-7 border-[2.5px] border-green-500 border-t-transparent rounded-full animate-spin"/>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-3xl mb-2">💬</div>
                      <p className="text-[13px] font-bold text-gray-600">No messages yet</p>
                      <p className="text-[11px] text-gray-400 mt-1">Start the conversation with this customer</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <MessageBubble key={msg._id} msg={msg} isMine={msg.senderId === user._id || msg.senderId?._id === user._id}/>
                    ))
                  )}
                  <div ref={bottomRef}/>
                </div>

                {/* Image preview */}
                {imagePreview && (
                  <div className="px-5 py-2 border-t border-gray-100 bg-white flex items-center gap-3">
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200"/>
                      <button onClick={clearImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-red-600 transition">×</button>
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{imageFile?.name}</p>
                  </div>
                )}

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick}/>
                    <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="Type a message… (Enter to send)" rows={1}
                      className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-gray-50/50 resize-none transition max-h-28 leading-relaxed"
                      style={{ overflowY: "auto" }}/>
                    <button type="submit" disabled={sending || (!text.trim() && !imageFile)}
                      className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0">
                      {sending
                        ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}