import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

// ── Helpers ────────────────────────────────────────────────
const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

const TYPE_META = {
  ORDER_PLACED:     { icon: "📦", color: "bg-blue-50  text-blue-600" },
  ORDER_STATUS:     { icon: "🚚", color: "bg-green-50 text-green-600" },
  PRODUCT_APPROVED: { icon: "✅", color: "bg-green-50  text-green-600" },
  PRODUCT_REJECTED: { icon: "❌", color: "bg-red-50   text-red-600" },
  PAYMENT_RECEIVED: { icon: "💰", color: "bg-amber-50 text-amber-600" },
  LOW_STOCK:        { icon: "🚨", color: "bg-red-50   text-red-600" },
};
const notifMeta = (type) => TYPE_META[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── NotificationBell ───────────────────────────────────────
function NotificationBell({ userId, onClose }) {
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState([]);
  const [unread,  setUnread]  = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifs(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  useEffect(() => {
    if (!userId) return;
    const socket = io("https://keshab-sigdel-health-haul-backend-production.up.railway.app", {
      query: { userId }, withCredentials: true,
    });
    socket.emit("joinUserRoom", userId);
    socket.on("newNotification", (n) => {
      setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]);
      setUnread(prev => prev + 1);
    });
    return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); };
  }, [userId]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put("/notifications/read-all");
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                   text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
      >
        <span className="flex-shrink-0 opacity-50 relative">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0
                 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
                 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white
                             text-[8px] font-black rounded-full flex items-center justify-center px-[2px] leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
        <span>Notifications</span>
        {unread > 0 && (
          <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        /* Mobile: full-width bottom sheet; Desktop: flyout to the right */
        <div className="
          fixed inset-x-0 bottom-0 z-[9999]
          sm:absolute sm:inset-auto sm:left-full sm:top-0 sm:ml-2
          w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl
          shadow-xl border border-gray-100 overflow-hidden flex flex-col
          max-h-[70vh] sm:max-h-none
        ">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-black text-gray-900">Notifications</p>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">
                  Mark all read
                </button>
              )}
              <button onClick={() => { setOpen(false); onClose?.(); }}
                className="text-gray-400 hover:text-gray-600 sm:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[380px]">
            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-[13px] font-bold text-gray-600">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : notifs.slice(0, 20).map(n => {
              const m = notifMeta(n.type);
              return (
                <button
                  key={n._id}
                  onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); onClose?.(); }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50
                              transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-300 mt-1 font-medium">{timeAgo(n.createdAt)}</p>
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

// ── Sidebar ────────────────────────────────────────────────
function Sidebar({ user, onLogout, navigate, open, onClose }) {
  const NAV = [
    { key: "dashboard",     label: "Dashboard",     path: "/pharmacy/dashboard",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { key: "orders",        label: "Orders",        path: "/pharmacy/orders",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
    { key: "products",      label: "Products",      path: "/pharmacy/products",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> },
    { key: "reviews",       label: "Reviews",       path: "/pharmacy/reviews",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> },
    { key: "chat",          label: "Messages",      path: "/pharmacy/chat",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg> },
    { key: "notifications", label: "Notifications", path: null, icon: null },
    { key: "profile",       label: "Profile",       path: "/pharmacy/profile",
      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  ];
  const active = "chat";

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-gray-100
        w-[200px] transition-transform duration-300 ease-in-out overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:z-20
      `}>
        {/* Brand */}
        <div className="px-5 py-[18px] border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0
                     00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* User pill */}
        <div className="px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p>
              <p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ key, label, path, icon }) => {
            if (key === "notifications") {
              return <NotificationBell key="notifications" userId={user?._id} onClose={onClose} />;
            }
            return (
              <button
                key={key}
                onClick={() => { navigate(path); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                            transition-all duration-150
                            ${active === key
                              ? "bg-gray-950 text-white shadow-sm"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-4 pt-1 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                       text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <span className="opacity-60 flex-shrink-0">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                     01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Mobile topbar ──────────────────────────────────────────
function MobileTopbar({ onMenuOpen }) {
  return (
    <div className="lg:hidden fixed top-0 inset-x-0 z-20 bg-white border-b border-gray-100
                    flex items-center gap-3 px-4 h-14 flex-shrink-0">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0
                 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span className="font-black text-[13px] text-gray-900">Messages</span>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────
function Avatar({ name, role, size = "md", online = false }) {
  const sizes    = { sm: "w-8 h-8 text-[11px]", md: "w-10 h-10 text-[13px]", lg: "w-12 h-12 text-[15px]" };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
  const gradient = role === "admin" ? "from-gray-700 to-gray-900" : "from-blue-500 to-indigo-600";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black`}>
        {name?.[0]?.toUpperCase() || "?"}
      </div>
      {online && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${dotSizes[size]} bg-green-400 rounded-full border-2 border-white`} />
      )}
    </div>
  );
}

// ── RoleBadge ──────────────────────────────────────────────
function RoleBadge({ roles }) {
  const role = (Array.isArray(roles) ? roles[0] : roles || "").toLowerCase();
  if (role === "admin") {
    return <span className="text-[9px] font-bold text-gray-100 bg-gray-800 px-1.5 py-0.5 rounded-full flex-shrink-0">Admin</span>;
  }
  return <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">User</span>;
}

// ── MessageBubble ──────────────────────────────────────────
function MessageBubble({ msg, isMine, onDelete }) {
  const [hovered,    setHovered]    = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
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
      <div className={`max-w-[75%] sm:max-w-[70%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
        {msg.image && (
          <div className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${isMine ? "rounded-br-sm" : "rounded-bl-sm"}`}>
            <img
              src={msg.image.startsWith("http") ? msg.image : `https://keshab-sigdel-health-haul-backend-production.up.railway.app/uploads/${msg.image}`}
              alt="attachment"
              className="max-w-[180px] sm:max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition"
              onClick={() => window.open(
                msg.image.startsWith("http") ? msg.image
                  : `https://keshab-sigdel-health-haul-backend-production.up.railway.app/uploads/${msg.image}`,
                "_blank"
              )}
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
            <button
              onClick={() => setConfirming(true)}
              className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
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

// ── Main component ─────────────────────────────────────────
export default function PharmacyChatPage() {
  const navigate = useNavigate();
  const [user,         setUser]         = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  // On mobile: show list (false) or chat window (true)
  const [mobileView,   setMobileView]   = useState("list"); // "list" | "chat"
  const [chatUsers,    setChatUsers]    = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [text,         setText]         = useState("");
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [onlineUsers,  setOnlineUsers]  = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMsgs,  setLoadingMsgs]  = useState(false);
  const [sending,      setSending]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [toast,        setToast]        = useState(null);

  const socketRef    = useRef(null);
  const bottomRef    = useRef(null);
  const fileInputRef = useRef(null);
  const selectedRef  = useRef(null);
  selectedRef.current = selected;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectUser = (u) => {
    setSelected(u);
    setMobileView("chat");
    setChatUsers(prev => prev.map(x => x._id === u._id ? { ...x, unreadCount: 0 } : x));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);

    const socket = io("https://keshab-sigdel-health-haul-backend-production.up.railway.app", {
      query: { userId: stored._id }, withCredentials: true,
    });
    socketRef.current = socket;
    socket.emit("joinUserRoom", stored._id);
    socket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));
    socket.on("newMessage", (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
      const senderId = msg.senderId?._id || msg.senderId;
      const isActive = selectedRef.current && selectedRef.current._id === senderId;
      setChatUsers(prev => {
        const updated = prev.map(u =>
          u._id === senderId
            ? {
                ...u,
                lastMessage:     msg.image ? "📷 Image" : msg.text || "",
                lastMessageAt:   Date.now(),
                hasConversation: true,
                unreadCount:     isActive ? (u.unreadCount || 0) : (u.unreadCount || 0) + 1,
              }
            : u
        );
        return [...updated].sort((a, b) => {
          if (a.hasConversation && !b.hasConversation) return -1;
          if (!a.hasConversation && b.hasConversation) return 1;
          if (a.hasConversation && b.hasConversation) return (b.lastMessageAt || 0) - (a.lastMessageAt || 0);
          return a.name.localeCompare(b.name);
        });
      });
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      if (imageFile)   fd.append("image", imageFile);
      const r = await api.post(`/chat/send/${selected._id}`, fd);
      const newMsg = r.data?.message;
      if (newMsg) setMessages(prev => prev.some(m => m._id === newMsg._id) ? prev : [...prev, newMsg]);
      setText(""); setImageFile(null); setImagePreview(null);
      setChatUsers(prev => {
        const updated = prev.map(u =>
          u._id === selected._id
            ? { ...u, lastMessage: text.trim() || "📷 Image", hasConversation: true, lastMessageAt: Date.now() }
            : u
        );
        return [...updated].sort((a, b) => {
          if (a.hasConversation && !b.hasConversation) return -1;
          if (!a.hasConversation && b.hasConversation) return 1;
          if (a.hasConversation && b.hasConversation) return (b.lastMessageAt || 0) - (a.lastMessageAt || 0);
          return a.name.localeCompare(b.name);
        });
      });
    } catch (err) { showToast(err.response?.data?.message || "Failed to send message", "error"); }
    finally { setSending(false); }
  }, [text, imageFile, selected, sending]);

  const handleKeyDown   = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const clearImage = () => {
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const filteredUsers = chatUsers.filter(u =>
    !search.trim()
    || u.name?.toLowerCase().includes(search.toLowerCase())
    || u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const isOnline    = (id) => onlineUsers.includes(id?.toString());
  const getUserRole = (roles) => (Array.isArray(roles) ? roles[0] : roles || "").toLowerCase();

  if (!user) return null;

  // ── User list panel ──────────────────────────────────────
  const UserListPanel = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3.5 border-b border-gray-100 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text" placeholder="Search users & admins…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-[12px]
                       focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400
                       bg-gray-50 transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loadingUsers ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-[13px] font-bold text-gray-600">No users or admins yet</p>
            <p className="text-[11px] text-gray-400 mt-1">They will appear here when available</p>
          </div>
        ) : filteredUsers.map(u => {
          const online     = isOnline(u._id);
          const isSelected = selected?._id === u._id;
          const role       = getUserRole(u.roles);
          const hasUnread  = (u.unreadCount || 0) > 0;
          return (
            <button
              key={u._id}
              onClick={() => handleSelectUser(u)}
              className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all
                          border-b border-gray-50 last:border-0 border-l-2
                          ${isSelected  ? "bg-green-50 border-l-green-500"
                          : hasUnread   ? "bg-green-50/30 border-l-green-400"
                          : "hover:bg-gray-50/70 border-l-transparent"}`}
            >
              <Avatar name={u.name} role={role} size="md" online={online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className={`text-[13px] truncate
                    ${isSelected  ? "text-green-700 font-bold"
                    : hasUnread   ? "text-gray-900 font-black"
                    : "text-gray-800 font-bold"}`}>
                    {u.name}
                  </p>
                  {hasUnread ? (
                    <span className="min-w-[18px] h-[18px] bg-green-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 flex-shrink-0">
                      {u.unreadCount > 9 ? "9+" : u.unreadCount}
                    </span>
                  ) : online ? (
                    <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Online</span>
                  ) : (
                    <RoleBadge roles={u.roles} />
                  )}
                </div>
                <p className={`text-[11px] truncate ${hasUnread ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                  {u.lastMessage || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── Chat window panel ────────────────────────────────────
  const ChatWindowPanel = (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Chat header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white flex-shrink-0">
        {/* Back button — mobile only */}
        <button
          onClick={() => setMobileView("list")}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        {selected && (
          <>
            <Avatar name={selected.name} role={getUserRole(selected.roles)} size="md" online={isOnline(selected._id)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-black text-gray-900 truncate">{selected.name}</p>
                <RoleBadge roles={selected.roles} />
              </div>
              <p className="text-[11px] text-gray-400">
                {isOnline(selected._id)
                  ? <span className="text-green-500 font-semibold">● Online</span>
                  : <span>{selected.email}</span>}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-gray-50/40">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-black text-gray-800 mb-1">Select a conversation</h3>
            <p className="text-[13px] text-gray-400 max-w-xs">
              Choose a customer or admin from the list to view and reply to their messages.
            </p>
          </div>
        ) : loadingMsgs ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-[2.5px] border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-[13px] font-bold text-gray-600">No messages yet</p>
            <p className="text-[11px] text-gray-400 mt-1">Start the conversation</p>
          </div>
        ) : messages.map(msg => (
          <MessageBubble
            key={msg._id}
            msg={msg}
            isMine={msg.senderId === user._id || msg.senderId?._id === user._id}
            onDelete={handleDeleteMessage}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 sm:px-5 py-2 border-t border-gray-100 bg-white flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <img src={imagePreview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
            <button onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-red-600 transition">
              ×
            </button>
          </div>
          <p className="text-[12px] text-gray-500 truncate">{imageFile?.name}</p>
        </div>
      )}

      {/* Input bar */}
      {selected && (
        <div className="px-3 sm:px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0
                     012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2
                     2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px]
                         focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400
                         bg-gray-50/50 resize-none transition max-h-28 leading-relaxed"
              style={{ overflowY: "auto" }}
            />
            <button
              type="submit"
              disabled={sending || (!text.trim() && !imageFile)}
              className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-xl
                         hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
            >
              {sending
                ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-4 left-4 sm:left-auto sm:w-auto z-[9999] flex items-center gap-2.5
                         px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold
                         ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      <MobileTopbar onMenuOpen={() => setSidebarOpen(true)} />
      <Sidebar user={user} onLogout={logout} navigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content: offset for desktop sidebar + mobile topbar */}
      <div className="lg:pl-[200px] pt-14 lg:pt-0 flex flex-col" style={{ height: "100dvh" }}>
        <main className="flex-1 flex flex-col min-h-0 px-3 sm:px-6 lg:px-8 py-4 lg:py-7">

          {/* Page title — hidden on mobile when in chat view */}
          <div className={`mb-4 flex-shrink-0 ${mobileView === "chat" ? "hidden lg:block" : "block"}`}>
            <h1 className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight">Messages</h1>
            <p className="text-gray-400 text-[13px] mt-0.5">Chat with your customers and admins</p>
          </div>

          {/* Chat container */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-1 min-h-0">

            {/* ── MOBILE: single-panel with toggle ── */}
            <div className="flex w-full lg:hidden">
              {mobileView === "list" ? (
                <div className="w-full flex flex-col">{UserListPanel}</div>
              ) : (
                <div className="w-full flex flex-col">{ChatWindowPanel}</div>
              )}
            </div>

            {/* ── DESKTOP: two-panel side by side ── */}
            <div className="hidden lg:flex w-full">
              {/* User list */}
              <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
                {UserListPanel}
              </div>

              {/* Chat window or empty state */}
              {!selected ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-black text-gray-800 mb-1">Select a conversation</h3>
                  <p className="text-[13px] text-gray-400 max-w-xs">
                    Choose a customer or admin from the list to view and reply to their messages.
                  </p>
                </div>
              ) : (
                ChatWindowPanel
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}