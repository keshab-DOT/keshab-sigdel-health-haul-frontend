import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

const TYPE_META = {
  ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" },
  ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" },
  PRODUCT_APPROVED: { icon: "✅", color: "bg-green-50 text-green-600" },
  PRODUCT_REJECTED: { icon: "❌", color: "bg-red-50 text-red-600" },
  PAYMENT_RECEIVED: { icon: "💰", color: "bg-amber-50 text-amber-600" },
  LOW_STOCK: { icon: "🚨", color: "bg-red-50 text-red-600" },
};
const notifMeta = (type) =>
  TYPE_META[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgo(date) {
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
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);
  useEffect(() => {
    if (!userId) return;
    const socket = io(
      "https://keshab-sigdel-health-haul-backend-production.up.railway.app",
      { query: { userId }, withCredentials: true },
    );
    socketRef.current = socket;
    socket.emit("joinUserRoom", userId);
    socket.on("newNotification", (n) => {
      setNotifs((prev) =>
        prev.some((x) => x._id === n._id) ? prev : [n, ...prev],
      );
      setUnread((prev) => prev + 1);
    });
    return () => {
      socket.emit("leaveUserRoom", userId);
      socket.disconnect();
    };
  }, [userId]);
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {}
  };
  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put("/notifications/read-all");
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
      >
        <span className="flex-shrink-0 opacity-50 relative">
          <svg
            className="w-[18px] h-[18px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-[2px] leading-none">
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
        <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-black text-gray-900">
                Notifications
              </p>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-green-600 hover:text-green-700 transition"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-[13px] font-bold text-gray-600">
                  No notifications yet
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifs.slice(0, 20).map((n) => {
                const m = notifMeta(n.type);
                return (
                  <button
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markRead(n._id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}
                    >
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-1 font-medium">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  user,
  active,
  onLogout,
  navigate,
  sidebarOpen,
  setSidebarOpen,
}) {
  const NAV = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/pharmacy/dashboard",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      path: "/pharmacy/orders",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      key: "products",
      label: "Products",
      path: "/pharmacy/products",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      key: "reviews",
      label: "Reviews",
      path: "/pharmacy/reviews",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      key: "chat",
      label: "Messages",
      path: "/pharmacy/chat",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"
          />
        </svg>
      ),
    },
    { key: "notifications", label: "Notifications", path: null, icon: null },
    {
      key: "profile",
      label: "Profile",
      path: "/pharmacy/profile",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-30 w-[200px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <button
        onClick={() => setSidebarOpen(false)}
        className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="px-5 py-[18px] border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">
            HealthHaul
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">
          Logged in as
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">
              {user?.name || "Pharmacy"}
            </p>
            <p className="text-[11px] text-green-600 font-semibold capitalize">
              Pharmacy
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => {
          if (key === "notifications")
            return <NotificationBell key="notifications" userId={user?._id} />;
          return (
            <button
              key={key}
              onClick={() => {
                navigate(path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <span
                className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}
              >
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <span className="opacity-60 flex-shrink-0">
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-semibold text-gray-500 w-8 text-right flex-shrink-0">
        {label}★
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-gray-400 w-6 flex-shrink-0">
        {count}
      </span>
    </div>
  );
}

export default function PharmacyReviews() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterRating, setFilterRating] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") {
      navigate("/login", { replace: true });
      return;
    }
    setUser(stored);
    fetchReviews();
  }, []);
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/my");
      setReviews(data.reviews || []);
      setAvgRating(data.averageRating || 0);
      setTotalCount(data.totalCount || 0);
    } catch {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const distColors = {
    5: "bg-green-500",
    4: "bg-lime-400",
    3: "bg-yellow-400",
    2: "bg-orange-400",
    1: "bg-red-400",
  };
  const filtered = reviews.filter((r) => {
    const matchRating =
      filterRating === "all" || r.rating === Number(filterRating);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.userId?.name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q);
    return matchRating && matchSearch;
  });
  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}
        >
          {toast.msg}
        </div>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 p-1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="font-black text-[14px] text-gray-900">HealthHaul</span>
      </div>
      <Sidebar
        user={user}
        active="reviews"
        onLogout={logout}
        navigate={navigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="lg:pl-[200px] pt-[52px] lg:pt-0">
        <main className="px-4 sm:px-8 py-7 min-h-screen">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-7">
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight leading-tight">
                My Reviews
              </h1>
              <p className="text-gray-400 text-[13px] mt-0.5">
                Customer feedback for your pharmacy
              </p>
            </div>
            <button
              onClick={fetchReviews}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm self-start"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Average Rating
                </p>
                <p className="text-5xl font-black text-gray-900 leading-none mb-2">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </p>
                <Stars rating={Math.round(avgRating)} />
                <p className="text-[11px] text-gray-400 mt-2">
                  {totalCount} review{totalCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-[12px] font-bold text-gray-700 mb-4">
                  Rating Breakdown
                </p>
                <div className="space-y-2.5">
                  {dist.map(({ star, count }) => (
                    <RatingBar
                      key={star}
                      label={star}
                      count={count}
                      total={totalCount}
                      color={distColors[star]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex flex-col sm:flex-row gap-2.5 mb-5">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by customer name or comment…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition bg-gray-50/50"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[140px]"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>
                  {s} Star{s !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-gray-100 rounded w-1/4 mb-2" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-[15px] font-bold text-gray-700 mb-1">
                {totalCount === 0
                  ? "No reviews yet"
                  : "No reviews match your filters"}
              </h3>
              <p className="text-[13px] text-gray-400 px-4">
                {totalCount === 0
                  ? "Customers can leave reviews after receiving a delivered order from you."
                  : "Try changing your search or filter."}
              </p>
              {(search || filterRating !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterRating("all");
                  }}
                  className="mt-5 bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[13px] flex-shrink-0">
                      {review.userId?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[14px] font-bold text-gray-800">
                            {review.userId?.name || "Customer"}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {review.userId?.email || ""}
                          </p>
                        </div>
                        <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1 flex-shrink-0">
                          <Stars rating={review.rating} />
                          <span className="text-[10px] text-gray-400">
                            {timeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      {review.comment ? (
                        <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
                          "{review.comment}"
                        </p>
                      ) : (
                        <p className="text-[12px] text-gray-400 italic">
                          No written comment.
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2.5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${review.rating >= 4 ? "bg-green-50 text-green-700 border-green-100" : review.rating === 3 ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-red-50 text-red-600 border-red-100"}`}
                        >
                          <span>
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                          {review.rating}/5
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-NP",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[12px] text-gray-400 px-1 pt-1">
                {filtered.length} of {totalCount} reviews shown
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
