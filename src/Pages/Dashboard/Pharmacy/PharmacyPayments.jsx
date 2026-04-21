import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const TYPE_META = {
  ORDER_PLACED: { icon: "📦", color: "bg-blue-50  text-blue-600" },
  ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" },
  PRODUCT_APPROVED: { icon: "✅", color: "bg-green-50  text-green-600" },
  PRODUCT_REJECTED: { icon: "❌", color: "bg-red-50   text-red-600" },
  PAYMENT_RECEIVED: { icon: "💰", color: "bg-amber-50 text-amber-600" },
  LOW_STOCK: { icon: "🚨", color: "bg-red-50   text-red-600" },
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

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

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
        <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[9999] overflow-hidden">
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
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-300 mt-1">
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

/* ─── Sidebar ────────────────────────────────────────────────────── */
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
      key: "payments",
      label: "Payments",
      path: "/pharmacy/payments",
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
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
      className={`fixed left-0 top-0 bottom-0 z-30 w-[220px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
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
      <div className="px-5 py-[18px] border-b border-gray-100 flex-shrink-0">
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
          <span className="font-black text-[14px] text-gray-900 tracking-tight">
            HealthHaul
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
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
            <p className="text-[11px] text-green-600 font-semibold">Pharmacy</p>
          </div>
        </div>
      </div>
      <nav className="flex-shrink-0 px-3 py-3 space-y-0.5">
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
      <div className="flex-shrink-0 px-3 pb-4 pt-1 border-t border-gray-100 mt-auto">
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

/* ─── Payment Row ────────────────────────────────────────────────── */
function PaymentRow({ payment }) {
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-600",
    pending: "bg-amber-100 text-amber-700",
  };
  const statusIcons = { completed: "✅", failed: "❌", pending: "⏳" };
  const cls = statusStyles[payment.status] || "bg-gray-100 text-gray-600";
  const sIcon = statusIcons[payment.status] || "🔔";

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Customer */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
              {payment.userId?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800">
                {payment.userId?.name || "Unknown"}
              </p>
              <p className="text-[10px] text-gray-400">
                {payment.userId?.email || "—"}
              </p>
            </div>
          </div>
        </td>

        {/* Amount */}
        <td className="py-3 px-4">
          <p className="text-[13px] font-black text-green-600">
            Rs. {Number(payment.amount).toLocaleString()}
          </p>
        </td>

        {/* Method */}
        <td className="py-3 px-4 hidden sm:table-cell">
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize">
            💳 {payment.method || "khalti"}
          </span>
        </td>

        {/* Transaction ID */}
        <td className="py-3 px-4 hidden md:table-cell">
          <p className="text-[11px] font-mono text-gray-500 truncate max-w-[130px]">
            {payment.transactionId || "—"}
          </p>
        </td>

        {/* Date */}
        <td className="py-3 px-4 hidden lg:table-cell">
          <p className="text-[12px] text-gray-600">
            {new Date(payment.createdAt).toLocaleDateString("en-NP", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-[10px] text-gray-400">
            {timeAgo(payment.createdAt)}
          </p>
        </td>

        {/* Status */}
        <td className="py-3 px-4">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cls}`}
          >
            {sIcon} {payment.status}
          </span>
        </td>

        {/* Expand chevron */}
        <td className="py-3 px-4">
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-gray-50/60 border-b border-gray-100">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Order ID
                </p>
                <p className="text-[12px] font-mono font-bold text-gray-700">
                  #
                  {String(payment.orderId?._id || payment.orderId)
                    .slice(-8)
                    .toUpperCase()}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  PIDX (Khalti)
                </p>
                <p className="text-[11px] font-mono text-gray-600 break-all">
                  {payment.pidx || "—"}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Transaction ID
                </p>
                <p className="text-[11px] font-mono text-gray-600 break-all">
                  {payment.transactionId || "—"}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Amount Paid
                </p>
                <p className="text-[14px] font-black text-green-600">
                  Rs. {Number(payment.amount).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Payment Date
                </p>
                <p className="text-[12px] font-bold text-gray-700">
                  {new Date(payment.createdAt).toLocaleString("en-NP")}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Customer Phone
                </p>
                <p className="text-[12px] font-bold text-gray-700">
                  {payment.userId?.phone || "—"}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function PharmacyPayments() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── fetch payments from the orders that belong to this pharmacy
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      // Get all orders for this pharmacy that are paid
      const { data } = await api.get("/orders/get/orders");
      const paidOrders = (data || []).filter((o) => o.paymentStatus === "paid");

      // Map each paid order into a payment-like object
      const mapped = paidOrders.map((o) => ({
        _id: o._id,
        orderId: { _id: o._id },
        userId: o.userId,
        amount: o.totalAmount,
        method: o.paymentMethod || "khalti",
        transactionId: o.khaltiTransactionId || null,
        pidx: o.khaltiPidx || null,
        status: "completed",
        createdAt: o.updatedAt || o.createdAt,
      }));

      setPayments(mapped);
      setFiltered(mapped);
    } catch {
      showToast("Failed to load payment history", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") {
      navigate("/login", { replace: true });
      return;
    }
    setUser(stored);
    fetchPayments();
  }, [fetchPayments, navigate]);

  // ── filter logic
  useEffect(() => {
    let result = [...payments];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.userId?.name?.toLowerCase().includes(q) ||
          p.userId?.email?.toLowerCase().includes(q) ||
          p.transactionId?.toLowerCase().includes(q) ||
          String(p.amount).includes(q),
      );
    }
    if (statusFilter !== "all")
      result = result.filter((p) => p.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, payments]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // ── summary stats
  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const completedCount = payments.filter(
    (p) => p.status === "completed",
  ).length;
  const khaltiCount = payments.filter((p) => p.method === "khalti").length;
  const codCount = payments.filter((p) => p.method === "cod").length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile top bar */}
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
        <span className="font-black text-[14px] text-gray-900">
          HealthHaul — Payments
        </span>
      </div>

      <Sidebar
        user={user}
        active="payments"
        onLogout={logout}
        navigate={navigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-[220px] pt-[52px] lg:pt-0">
        <main className="px-4 sm:px-8 py-7 min-h-screen">
          {/* Page header */}
          <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-black text-gray-900 tracking-tight">
                Payment History
              </h1>
              <p className="text-gray-400 text-[13px] mt-0.5">
                All payments received from your customers
              </p>
            </div>
            <button
              onClick={fetchPayments}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm self-start sm:self-auto"
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

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {[
              {
                label: "Total Revenue",
                value: `Rs. ${totalRevenue.toLocaleString()}`,
                icon: "💰",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Paid Orders",
                value: completedCount,
                icon: "✅",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Khalti Payments",
                value: khaltiCount,
                icon: "💳",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                label: "Cash on Delivery",
                value: codCount,
                icon: "🏷️",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}
                >
                  {s.icon}
                </div>
                <p
                  className={`text-xl sm:text-2xl font-black ${s.color} leading-none mb-1`}
                >
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search + filter bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 mb-5 flex flex-col sm:flex-row gap-2.5">
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
                placeholder="Search by customer name, email or transaction ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-gray-50/50 transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[130px]"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black text-gray-900">
                  Transactions
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {loading
                    ? "Loading…"
                    : `${filtered.length} of ${payments.length} payments`}
                </p>
              </div>
              {filtered.length > 0 && (
                <span className="text-[12px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                  Total: Rs.{" "}
                  {filtered
                    .reduce((s, p) => s + Number(p.amount), 0)
                    .toLocaleString()}
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center px-4">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="text-[15px] font-bold text-gray-700 mb-1">
                  No payments found
                </h3>
                <p className="text-gray-400 text-[13px]">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Payments will appear here once customers complete orders."}
                </p>
                {(search || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {[
                        { label: "CUSTOMER", cls: "" },
                        { label: "AMOUNT", cls: "" },
                        { label: "METHOD", cls: "hidden sm:table-cell" },
                        {
                          label: "TRANSACTION ID",
                          cls: "hidden md:table-cell",
                        },
                        { label: "DATE", cls: "hidden lg:table-cell" },
                        { label: "STATUS", cls: "" },
                        { label: "", cls: "" },
                      ].map(({ label, cls }) => (
                        <th
                          key={label}
                          className={`py-2.5 px-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest ${cls}`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((payment) => (
                      <PaymentRow key={payment._id} payment={payment} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
