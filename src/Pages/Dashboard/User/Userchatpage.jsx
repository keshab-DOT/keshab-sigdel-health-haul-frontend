import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const TYPE_META_N = {
  ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" },
  ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" },
  PAYMENT_SUCCESS: { icon: "💰", color: "bg-amber-50 text-amber-600" },
};
const notifMetaN = (type) => TYPE_META_N[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgoN(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifs(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  useEffect(() => {
    if (!userId) return;
    const socket = io("http://localhost:3000", { query: { userId }, withCredentials: true });
    socketRef.current = socket;
    socket.emit("joinUserRoom", userId);
    socket.on("newNotification", (n) => {
      setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]);
      setUnread(prev => prev + 1);
    });
    return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); };
  }, [userId]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put("/notifications/read-all");
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch { }
  };

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition"
        title="Notifications">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-[3px] leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-black text-gray-900">Notifications</p>
              {unread > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}
            </div>
            {unread > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : notifs.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-[13px] font-bold text-gray-600">No notifications yet</p>
              </div>
            ) : notifs.slice(0, 20).map(n => {
              const m = notifMetaN(n.type);
              return (
                <button key={n._id} onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ user, onLogout, navigate }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Dashboard</button>
        <button onClick={() => navigate("/user/search")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
        <button onClick={() => navigate("/user/chat")} className="px-3.5 py-1.5 text-[13px] font-semibold text-gray-900 bg-gray-100 rounded-lg">Chat</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </button>
        <NotificationBell userId={user?._id} />
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left">
            <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p>
          </div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
}

function Avatar({ name, size = "md", online = false }) {
  const sizes = { sm: "w-8 h-8 text-[11px]", md: "w-10 h-10 text-[13px]", lg: "w-12 h-12 text-[15px]" };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black`}>
        {name?.[0]?.toUpperCase() || "?"}
      </div>
      {online && <span className={`absolute -bottom-0.5 -right-0.5 ${dotSizes[size]} bg-green-400 rounded-full border-2 border-white`} />}
    </div>
  );
}

function MessageBubble({ msg, isMine, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const time = new Date(msg.createdAt).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });

  const handleConfirm = async () => {
    setDeleting(true);
    await onDelete(msg._id);
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <div
      className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
    >
      <div className={`max-w-[70%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
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

      {isMine && (
        <div className="flex items-center mb-5 flex-shrink-0">
          {hovered && !confirming && (
            <button onClick={() => setConfirming(true)}
              className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete message">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
          {confirming && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl shadow-md px-2.5 py-1.5">
              <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap">Delete?</span>
              <button onClick={handleConfirm} disabled={deleting}
                className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-lg transition disabled:opacity-50">
                {deleting ? "…" : "Yes"}
              </button>
              <button onClick={() => setConfirming(false)}
                className="text-[11px] font-bold text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded-lg hover:bg-gray-100 transition">
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserChatPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  // Keep a ref to selected so the socket handler can read the latest value
  const selectedRef = useRef(null);
  selectedRef.current = selected;

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // Select a user and immediately clear their unread badge
  const handleSelectUser = (u) => {
    setSelected(u);
    setChatUsers(prev =>
      prev.map(x => x._id === u._id ? { ...x, unreadCount: 0 } : x)
    );
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);

    const socket = io("http://localhost:3000", { query: { userId: stored._id }, withCredentials: true });
    socketRef.current = socket;
    socket.emit("joinUserRoom", stored._id);
    socket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));

    socket.on("newMessage", (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
      // Increment unread count for the sender if they are not the currently open conversation
      const senderId = msg.senderId?._id || msg.senderId;
      if (!selectedRef.current || selectedRef.current._id !== senderId) {
        setChatUsers(prev =>
          prev.map(u =>
            u._id === senderId
              ? { ...u, unreadCount: (u.unreadCount || 0) + 1, lastMessage: msg.image ? "📷 Image" : msg.text || "" }
              : u
          )
        );
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    return () => { socket.emit("leaveUserRoom", stored._id); socket.disconnect(); };
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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await api.delete(`/chat/messages/${messageId}`);
      setMessages(prev => prev.filter(m => m._id !== messageId));
    } catch (err) { showToast(err.response?.data?.message || "Failed to delete message", "error"); }
  }, []);

  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !imageFile) || !selected || sending) return;
    setSending(true);
    try {
      const fd = new FormData();
      if (text.trim()) fd.append("text", text.trim());
      if (imageFile) fd.append("image", imageFile);
      const r = await api.post(`/chat/send/${selected._id}`, fd);
      const newMsg = r.data?.message;
      if (newMsg) setMessages(prev => prev.some(m => m._id === newMsg._id) ? prev : [...prev, newMsg]);
      setText(""); setImageFile(null); setImagePreview(null);
      setChatUsers(prev => prev.map(u => u._id === selected._id ? { ...u, lastMessage: text.trim() || "📷 Image", hasConversation: true } : u));
    } catch (err) { showToast(err.response?.data?.message || "Failed to send message", "error"); }
    finally { setSending(false); }
  }, [text, imageFile, selected, sending]);

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleImagePick = (e) => { const file = e.target.files[0]; if (!file) return; setImageFile(file); setImagePreview(URL.createObjectURL(file)); };
  const clearImage = () => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleLogout = async () => { try { await api.post("/auth/logout"); } catch (_) { } localStorage.removeItem("user"); navigate("/login"); };

  const filteredUsers = chatUsers.filter(u =>
    !search.trim() || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const isOnline = (id) => onlineUsers.includes(id?.toString());

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      <Topbar user={user} onLogout={handleLogout} navigate={navigate} />

      <main className="flex-1 px-8 py-6">
        <div className="mb-4">
          <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Messages</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Chat with pharmacies about your orders or medicines</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>

          {/* LEFT: Pharmacy list */}
          <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
            <div className="p-3.5 border-b border-gray-100">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search pharmacies…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-gray-50 transition" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingUsers ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-100 rounded w-2/3" /><div className="h-2.5 bg-gray-100 rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="text-3xl mb-2">🏥</div>
                  <p className="text-[13px] font-bold text-gray-600">No pharmacies found</p>
                  <p className="text-[11px] text-gray-400 mt-1">Pharmacies will appear here once available</p>
                </div>
              ) : filteredUsers.map(u => {
                const online = isOnline(u._id);
                const isSelected = selected?._id === u._id;
                const hasUnread = (u.unreadCount || 0) > 0;
                return (
                  <button key={u._id} onClick={() => handleSelectUser(u)}
                    className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all border-b border-gray-50 last:border-0
                      ${isSelected ? "bg-green-50 border-l-2 border-l-green-500" : hasUnread ? "bg-green-50/30 border-l-2 border-l-green-400" : "hover:bg-gray-50/70 border-l-2 border-l-transparent"}`}>
                    <Avatar name={u.name} size="md" online={online} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-[13px] truncate ${isSelected ? "text-green-700 font-bold"
                            : hasUnread ? "text-gray-900 font-black"
                              : "text-gray-800 font-bold"
                          }`}>{u.name}</p>

                        {hasUnread ? (
                          <span className="min-w-[18px] h-[18px] bg-green-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {u.unreadCount > 9 ? "9+" : u.unreadCount}
                          </span>
                        ) : online ? (
                          <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Online</span>
                        ) : null}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${hasUnread ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                        {u.lastMessage || "Start a conversation"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Chat window */}
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
              </div>
              <h3 className="text-[16px] font-black text-gray-800 mb-1">Select a pharmacy</h3>
              <p className="text-[13px] text-gray-400 max-w-xs">Choose a pharmacy from the list to start chatting about medicines or your orders.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
                <Avatar name={selected.name} size="md" online={isOnline(selected._id)} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-gray-900">{selected.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {isOnline(selected._id)
                      ? <span className="text-green-500 font-semibold">● Online</span>
                      : <span>Pharmacy · {selected.email}</span>}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/40">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full"><div className="w-7 h-7 border-[2.5px] border-green-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-3xl mb-2">👋</div>
                    <p className="text-[13px] font-bold text-gray-600">Start a conversation</p>
                    <p className="text-[11px] text-gray-400 mt-1">Ask about medicines, availability, or your orders</p>
                  </div>
                ) : messages.map(msg => (
                  <MessageBubble key={msg._id} msg={msg}
                    isMine={msg.senderId === user._id || msg.senderId?._id === user._id}
                    onDelete={handleDeleteMessage} />
                ))}
                <div ref={bottomRef} />
              </div>

              {imagePreview && (
                <div className="px-5 py-2 border-t border-gray-100 bg-white flex items-center gap-3">
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                    <button onClick={clearImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-red-600 transition">×</button>
                  </div>
                  <p className="text-[12px] text-gray-500 truncate">{imageFile?.name}</p>
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                  <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)" rows={1}
                    className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-gray-50/50 resize-none transition max-h-28 leading-relaxed"
                    style={{ overflowY: "auto" }} />
                  <button type="submit" disabled={sending || (!text.trim() && !imageFile)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0">
                    {sending
                      ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}