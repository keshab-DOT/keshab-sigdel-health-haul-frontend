import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// ── Fix Leaflet broken icons in Vite ──────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (emoji, bg, size = 34) =>
  L.divIcon({
    html: `<div style="background:${bg};color:white;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${size * 0.47}px;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3)">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

const PHARMACY_ICON = makeIcon("🏥", "#16a34a");
const PHARMACY_LIVE_ICON = makeIcon("🏥", "#dc2626");

function BoundsFitter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2)
      map.fitBounds(L.latLngBounds(positions), {
        padding: [40, 40],
        animate: true,
      });
    else if (positions.length === 1)
      map.setView(positions[0], 14, { animate: true });
  }, [positions, map]);
  return null;
}

// ── Notification helpers ──────────────────────────────────────────────────────
const TYPE_META = {
  ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" },
  ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" },
  PRODUCT_APPROVED: { icon: "✅", color: "bg-green-50 text-green-600" },
  PRODUCT_REJECTED: { icon: "❌", color: "bg-red-50 text-red-600" },
  PRODUCT_APPROVAL_NEEDED: { icon: "🆕", color: "bg-amber-50 text-amber-600" },
  PAYMENT_RECEIVED: { icon: "💰", color: "bg-amber-50 text-amber-600" },
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

// ── NotificationBell ──────────────────────────────────────────────────────────
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
        <span className="hidden lg:inline">Notifications</span>
        {unread > 0 && (
          <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full hidden lg:flex">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full top-0 ml-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[9999] overflow-hidden">
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

// ── AdminSidebar ──────────────────────────────────────────────────────────────
export function AdminSidebar({ active, navigate, onLogout, admin }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV = [
    {
      key: "overview",
      label: "Overview",
      path: "/admin/dashboard",
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
      key: "products",
      label: "Product Approvals",
      path: "/admin/products",
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
      key: "users",
      label: "User Management",
      path: "/admin/users",
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: "chat",
      label: "Messages",
      path: "/admin/chat",
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
    {
      key: "reviews",
      label: "Reviews",
      path: "/admin/reviews",
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
    { key: "notifications", label: "Notifications", path: null, icon: null },
  ];

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="font-black text-[15px] text-gray-900 tracking-tight hidden lg:block">
            HealthHaul
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100 hidden lg:block">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">
          Logged in as
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">
              {admin?.name || "Admin"}
            </p>
            <p className="text-[11px] text-green-600 font-semibold">
              Administrator
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => {
          if (key === "notifications")
            return <NotificationBell key="notifications" userId={admin?._id} />;
          return (
            <button
              key={key}
              onClick={() => {
                navigate(path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <span
                className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}
              >
                {icon}
              </span>
              <span className="hidden lg:inline">{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-5 pt-1 border-t border-gray-100">
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
          <span className="hidden lg:inline">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
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
          <span className="font-black text-[15px] text-gray-900">
            HealthHaul
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white flex flex-col h-full z-50 shadow-xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
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
            </div>
            {/* Mobile: show user info */}
            <div className="px-4 py-3.5 border-b border-gray-100 mt-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-white font-black text-[11px]">
                  A
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800">
                    {admin?.name || "Admin"}
                  </p>
                  <p className="text-[11px] text-green-600 font-semibold">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              {NAV.map(({ key, label, path, icon }) => {
                if (key === "notifications")
                  return (
                    <NotificationBell key="notifications" userId={admin?._id} />
                  );
                return (
                  <button
                    key={key}
                    onClick={() => {
                      navigate(path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${active === key ? "bg-gray-950 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
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
            <div className="px-3 pb-5 pt-1 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition"
              >
                <svg
                  className="w-[18px] h-[18px] opacity-60"
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
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar (icon-only on md, full on lg) */}
      <aside className="hidden lg:flex w-[220px] min-h-screen bg-white border-r border-gray-100 flex-col fixed left-0 top-0 bottom-0 z-20">
        <SidebarContent />
      </aside>

      {/* Compact icon sidebar for md screens */}
      <aside className="hidden md:flex lg:hidden w-16 min-h-screen bg-white border-r border-gray-100 flex-col fixed left-0 top-0 bottom-0 z-20">
        <SidebarContent />
      </aside>
    </>
  );
}

// ── PharmacyMapMonitor ────────────────────────────────────────────────────────
function PharmacyMapMonitor({ admin, adminSocketRef }) {
  const [pharmacies, setPharmacies] = useState({});
  const [loadingDB, setLoadingDB] = useState(true);
  const DEFAULT_CENTER = [27.7172, 85.324];

  useEffect(() => {
    api
      .get("/admin/users")
      .then(({ data }) => {
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : [];
        const map = {};
        raw.forEach((u) => {
          const role = (
            Array.isArray(u.roles) ? u.roles[0] : u.roles || ""
          ).toLowerCase();
          if (role !== "pharmacy") return;
          const lat = Number(u.location?.latitude);
          const lng = Number(u.location?.longitude);
          if (lat && lng) {
            map[u._id] = {
              name: u.name || "Pharmacy",
              lat,
              lng,
              isLive: false,
              lastSeen: null,
            };
          }
        });
        setPharmacies(map);
      })
      .catch(() => {})
      .finally(() => setLoadingDB(false));
  }, []);

  useEffect(() => {
    if (!adminSocketRef?.current) return;
    const socket = adminSocketRef.current;
    const handler = ({ pharmacyId, pharmacyName, latitude, longitude }) => {
      if (!pharmacyId) return;
      setPharmacies((prev) => ({
        ...prev,
        [pharmacyId]: {
          name: pharmacyName || prev[pharmacyId]?.name || "Pharmacy",
          lat: latitude,
          lng: longitude,
          isLive: true,
          lastSeen: new Date(),
        },
      }));
    };
    socket.on("pharmacyLocation", handler);
    return () => {
      socket.off("pharmacyLocation", handler);
    };
  }, [adminSocketRef]);

  const pins = Object.entries(pharmacies);
  const liveCount = pins.filter(([, p]) => p.isLive).length;
  const positions = pins.map(([, p]) => [p.lat, p.lng]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[14px] sm:text-[15px] font-black text-gray-900">
            🗺️ Pharmacy Location Monitor
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Saved DB locations + live GPS streams
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-600">
                {liveCount} live
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <span className="text-[11px] font-bold text-green-700">
              {pins.length} pharmacies
            </span>
          </div>
        </div>
      </div>

      {loadingDB ? (
        <div className="flex items-center justify-center h-[260px] sm:h-[340px]">
          <div className="text-center">
            <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[12px] text-gray-400">
              Loading pharmacy locations…
            </p>
          </div>
        </div>
      ) : (
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          style={{ height: "260px", width: "100%" }}
          className="sm:!h-[340px]"
          scrollWheelZoom={true}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {positions.length > 0 && <BoundsFitter positions={positions} />}
          {pins.map(([id, p]) => (
            <Marker
              key={id}
              position={[p.lat, p.lng]}
              icon={p.isLive ? PHARMACY_LIVE_ICON : PHARMACY_ICON}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <p className="text-[13px] font-bold text-gray-900 mb-1">
                    {p.isLive ? "🔴" : "🏥"} {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {p.isLive
                      ? "Broadcasting live GPS"
                      : "Saved location from DB"}
                  </p>
                  {p.lastSeen && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Updated {timeAgo(p.lastSeen)}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1 font-mono">
                    {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow-sm flex items-center justify-center text-[8px]">
            🏥
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            Saved in DB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center text-[8px]">
            🏥
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            Live GPS active
          </span>
        </div>
        <span className="ml-auto text-[10px] text-gray-400 hidden sm:block">
          Click a pin for details · Scroll to zoom
        </span>
      </div>

      {pins.length > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-50 max-h-[220px] overflow-y-auto">
          {pins.map(([id, p]) => (
            <div
              key={id}
              className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${p.isLive ? "bg-red-500 animate-pulse" : "bg-green-400"}`}
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.isLive && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
                {p.lastSeen && (
                  <span className="text-[10px] text-gray-400 hidden sm:block">
                    {timeAgo(p.lastSeen)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingDB && pins.length === 0 && (
        <div className="px-5 py-10 text-center">
          <div className="text-3xl mb-2">🏥</div>
          <p className="text-[13px] font-semibold text-gray-600">
            No pharmacy locations yet
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Locations appear when pharmacies save or broadcast their GPS
          </p>
        </div>
      )}
    </div>
  );
}

// ── AdminDashboard (default export) ──────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    pendingProducts: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);

  const adminSocketRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (
      Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || ""
    ).toLowerCase();
    if (!stored || role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }
    setAdmin(stored);
    fetchData();

    const socket = io(
      "https://keshab-sigdel-health-haul-backend-production.up.railway.app",
      {
        query: { userId: stored._id, role: "admin" },
        withCredentials: true,
      },
    );
    adminSocketRef.current = socket;
    socket.emit("joinUserRoom", stored._id);
    socket.emit("joinAdminRoom");

    return () => {
      socket.emit("leaveUserRoom", stored._id);
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/admin/products"),
      ]);

      let users = [];
      if (usersRes.status === "fulfilled") {
        const raw = usersRes.value.data;
        users = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.users)
            ? raw.users
            : [];
      }
      let products = [];
      if (productsRes.status === "fulfilled") {
        const raw = productsRes.value.data;
        products = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.products)
            ? raw.products
            : [];
      }

      setStats({
        totalUsers: users.filter(
          (u) =>
            (Array.isArray(u.roles)
              ? u.roles[0]
              : u.roles || ""
            ).toLowerCase() === "user",
        ).length,
        totalPharmacies: users.filter(
          (u) =>
            (Array.isArray(u.roles)
              ? u.roles[0]
              : u.roles || ""
            ).toLowerCase() === "pharmacy",
        ).length,
        pendingProducts: products.filter((p) => p.approvalStatus === "Pending")
          .length,
      });
      setRecentUsers(users.slice(0, 6));
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (adminSocketRef.current) adminSocketRef.current.disconnect();
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!admin) return null;

  const STAT_CARDS = [
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pharmacies",
      value: stats.totalPharmacies,
      icon: "🏥",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingProducts,
      icon: "⏳",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <AdminSidebar
        active="overview"
        navigate={navigate}
        onLogout={logout}
        admin={admin}
      />

      {/* Offset: pt for mobile topbar, pl for desktop sidebar */}
      <div className="pt-14 md:pt-0 md:pl-16 lg:pl-[220px]">
        <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-7 min-h-screen">
          <div className="flex items-center justify-between mb-5 sm:mb-7">
            <div>
              <h1 className="text-[20px] sm:text-[26px] font-black text-gray-900 tracking-tight">
                Overview
              </h1>
              <p className="text-gray-400 text-[12px] sm:text-[13px] mt-0.5">
                Platform summary
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[12px] sm:text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm"
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
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stat cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-7">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-[100px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-7">
              {STAT_CARDS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}
                  >
                    {s.icon}
                  </div>
                  <p
                    className={`text-2xl font-black ${s.color} leading-none mb-1`}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {stats.pendingProducts > 0 && (
            <div className="flex flex-wrap items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 sm:px-5 py-3.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <p className="text-[12px] sm:text-[13px] font-semibold text-amber-800">
                <span className="font-black">{stats.pendingProducts}</span>{" "}
                product{stats.pendingProducts > 1 ? "s" : ""} waiting for your
                approval
              </p>
              <button
                onClick={() => navigate("/admin/products")}
                className="ml-auto text-[11px] font-bold text-amber-700 underline underline-offset-2"
              >
                Review now →
              </button>
            </div>
          )}

          <PharmacyMapMonitor admin={admin} adminSocketRef={adminSocketRef} />

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] sm:text-[15px] font-black text-gray-900">
                  Recent Users
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Latest registered accounts
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-[12px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 hover:text-gray-900 transition"
              >
                View all →
              </button>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-[13px] text-gray-400">No users yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentUsers.map((user) => {
                  const role = (
                    Array.isArray(user.roles)
                      ? user.roles[0]
                      : user.roles || "user"
                  ).toLowerCase();
                  const status = user.status || "Active";
                  const roleBg =
                    role === "pharmacy"
                      ? "bg-green-100 text-green-700"
                      : role === "admin"
                        ? "bg-gray-800 text-white"
                        : "bg-blue-100 text-blue-700";
                  const statusBg =
                    status === "Banned"
                      ? "bg-red-100 text-red-600"
                      : status === "Suspended"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700";
                  return (
                    <div
                      key={user._id}
                      className="px-4 sm:px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors gap-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[12px] flex-shrink-0 ${status === "Active" ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gray-300"}`}
                        >
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-gray-800 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full capitalize ${roleBg}`}
                        >
                          {role}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full hidden sm:inline-flex ${statusBg}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Quick Actions
            </p>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => navigate("/admin/products")}
                className="flex items-center gap-2 bg-gray-950 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[12px] sm:text-[13px] hover:bg-gray-800 transition"
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
                    strokeWidth={1.75}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span className="hidden sm:inline">Product Approvals</span>
                <span className="sm:hidden">Approvals</span>
                {stats.pendingProducts > 0 && (
                  <span className="w-5 h-5 bg-amber-400 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {stats.pendingProducts}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[12px] sm:text-[13px] hover:border-green-300 hover:text-green-700 transition"
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
                    strokeWidth={1.75}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Manage Users</span>
                <span className="sm:hidden">Users</span>
              </button>
              <button
                onClick={() => navigate("/admin/chat")}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[12px] sm:text-[13px] hover:border-green-300 hover:text-green-700 transition"
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
                    strokeWidth={1.75}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"
                  />
                </svg>
                Messages
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
