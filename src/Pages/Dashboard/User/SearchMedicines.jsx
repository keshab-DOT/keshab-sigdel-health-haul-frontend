import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const toArr = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products)) return data.products;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

const TYPE_META_N = { ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" }, ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" }, PAYMENT_SUCCESS: { icon: "💰", color: "bg-amber-50 text-amber-600" } };
const notifMetaN = (type) => TYPE_META_N[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgoN(date) { const diff = Math.floor((Date.now() - new Date(date)) / 1000); if (diff < 60) return "just now"; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`; if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; return `${Math.floor(diff / 86400)}d ago`; }

function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false); const [notifs, setNotifs] = useState([]); const [unread, setUnread] = useState(0); const [loading, setLoading] = useState(true); const dropdownRef = useRef(null);
  const fetchNotifs = useCallback(async () => { try { const { data } = await api.get("/notifications"); setNotifs(data.notifications || []); setUnread(data.unreadCount || 0); } catch { } finally { setLoading(false); } }, []);
  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);
  useEffect(() => { if (!userId) return; const socket = io("https://keshab-sigdel-health-haul-backend-production.up.railway.app", { query: { userId }, withCredentials: true }); socket.emit("joinUserRoom", userId); socket.on("newNotification", (n) => { setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]); setUnread(prev => prev + 1); }); return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); }; }, [userId]);
  useEffect(() => { const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const markRead = async (id) => { try { await api.put(`/notifications/${id}/read`); setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n)); setUnread(prev => Math.max(0, prev - 1)); } catch { } };
  const markAllRead = async (e) => { e.stopPropagation(); try { await api.put("/notifications/read-all"); setNotifs(prev => prev.map(n => ({ ...n, isRead: true }))); setUnread(0); } catch { } };
  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition" title="Notifications">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unread > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-[3px] leading-none">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><p className="text-[14px] font-black text-gray-900">Notifications</p>{unread > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}</div>
            {unread > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
              : notifs.length === 0 ? <div className="py-12 text-center"><div className="text-3xl mb-2">🔔</div><p className="text-[13px] font-bold text-gray-600">No notifications yet</p></div>
              : notifs.slice(0, 20).map(n => { const m = notifMetaN(n.type); return (<button key={n._id} onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); }} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}><div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div><div className="flex-1 min-w-0"><p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p><p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p><p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p></div>{!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />}</button>); })}
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ user, cartCount, onLogout, navigate }) {
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
        <button onClick={() => navigate("/user/search")} className="px-3.5 py-1.5 text-[13px] font-semibold text-gray-900 bg-gray-100 rounded-lg">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
        <button onClick={() => navigate("/user/chat")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Chat</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>
        <NotificationBell userId={user?._id} />
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left"><p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p><p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p></div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  const quickLinks = [{ label: "Search Medicines", path: "/user/search" }, { label: "My Orders", path: "/user/orders" }, { label: "My Cart", path: "/user/cart" }, { label: "Profile", path: "/user/profile" }];
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Your trusted partner for fast and reliable medicine delivery across Nepal.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{quickLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-white transition text-left w-full">{label}</button></li>))}</ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Us</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg><a href="mailto:sigdelbibek9898@gmail.com" className="hover:text-white transition break-all">sigdelbibek9898@gmail.com</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg><a href="tel:9829396927" className="hover:text-white transition">9829396927</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg><span>Itahari-8, Sunsari, Nepal</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function Stars({ rating, size = "sm", interactive = false, onRate }) {
  const sz = size === "sm" ? "w-3 h-3" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" disabled={!interactive} onClick={() => interactive && onRate && onRate(i)} className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}>
          <svg className={`${sz} ${i <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ pharmacy, onClose, onSubmitted, currentUserId }) {
  const [reviews, setReviews] = useState([]); const [loading, setLoading] = useState(true); const [avgRating, setAvgRating] = useState(0); const [totalCount, setTotalCount] = useState(0);
  const [myRating, setMyRating] = useState(0); const [myComment, setMyComment] = useState(""); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(""); const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  useEffect(() => { fetchReviews(); }, [pharmacy._id]); // eslint-disable-line react-hooks/exhaustive-deps
  const fetchReviews = async () => {
    setLoading(true);
    try { const { data } = await api.get(`/reviews/pharmacy/${pharmacy._id}`); setReviews(data.reviews || []); setAvgRating(data.averageRating || 0); setTotalCount(data.totalCount || 0); const mine = (data.reviews || []).find(r => r.userId?._id === currentUserId || r.userId === currentUserId); if (mine) setAlreadyReviewed(true); }
    catch { } finally { setLoading(false); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!myRating) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    try { const { data } = await api.post("/reviews", { pharmacyId: pharmacy._id, rating: myRating, comment: myComment.trim() }); setReviews(prev => [data.data, ...prev]); setTotalCount(c => c + 1); setAvgRating(prev => Math.round(((prev * totalCount + myRating) / (totalCount + 1)) * 10) / 10); setAlreadyReviewed(true); setMyRating(0); setMyComment(""); if (onSubmitted) onSubmitted(pharmacy._id, data.data); }
    catch (err) { setError(err.response?.data?.message || "Failed to submit review."); } finally { setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div><h3 className="text-[15px] font-black text-gray-900">{pharmacy.name}</h3><div className="flex items-center gap-2 mt-0.5"><Stars rating={Math.round(avgRating)} /><span className="text-[12px] font-bold text-gray-700">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span><span className="text-[11px] text-gray-400">({totalCount} review{totalCount !== 1 ? "s" : ""})</span></div></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            {alreadyReviewed ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5"><svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-[12px] font-semibold">You've already reviewed this pharmacy.</span></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-[13px] font-bold text-gray-800">Write a Review</p>
                <p className="text-[11px] text-gray-400 -mt-1">Only available after a delivered order from this pharmacy.</p>
                <div><p className="text-[11px] font-semibold text-gray-600 mb-1">Your Rating *</p><Stars rating={myRating} size="lg" interactive onRate={setMyRating} /></div>
                <textarea value={myComment} onChange={e => setMyComment(e.target.value)} placeholder="Share your experience… (optional)" rows={3} maxLength={500} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 resize-none bg-white transition" />
                {error && <p className="text-[12px] text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>}
                <button type="submit" disabled={submitting || !myRating} className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-gray-800 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {submitting ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting…</> : "Submit Review"}
                </button>
              </form>
            )}
          </div>
          <div className="px-6 py-4 space-y-4">
            <p className="text-[13px] font-bold text-gray-800">{totalCount > 0 ? `${totalCount} Review${totalCount !== 1 ? "s" : ""}` : "No reviews yet"}</p>
            {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
              : reviews.length === 0 ? <div className="text-center py-8"><div className="text-3xl mb-2">💬</div><p className="text-[13px] text-gray-500 font-medium">No reviews yet</p></div>
              : reviews.map(r => (
                <div key={r._id} className="bg-gray-50 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{r.userId?.name?.[0]?.toUpperCase() || "U"}</div><p className="text-[13px] font-bold text-gray-800">{r.userId?.name || "User"}</p></div><Stars rating={r.rating} /></div>
                  {r.comment && <p className="text-[12px] text-gray-600 leading-relaxed pl-9">{r.comment}</p>}
                  <p className="text-[10px] text-gray-400 pl-9">{timeAgoN(r.createdAt)}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, adding, onReviewClick, pharmacyRatings }) {
  const [qty, setQty] = useState(1);
  const outOfStock = product.productTotalStockQuantity === 0;
  const lowStock = !outOfStock && product.productTotalStockQuantity <= 5;
  const pharmacy = product.userId;
  const rating = pharmacy ? (pharmacyRatings[pharmacy._id] || null) : null;
  const src = product.productImageUrl ? (product.productImageUrl.startsWith("http") ? product.productImageUrl : `https://keshab-sigdel-health-haul-backend-production.up.railway.app/uploads/${product.productImageUrl}`) : null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group">
      <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden relative">
        {src ? <img src={src} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display = "none"; }} /> : <span className="text-5xl opacity-40">💊</span>}
        {outOfStock && <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center"><span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">Out of Stock</span></div>}
        {lowStock && <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Only {product.productTotalStockQuantity} left</div>}
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <h4 className="font-bold text-gray-800 text-[12px] leading-snug mb-0.5 truncate">{product.productName}</h4>
        <p className="text-[10px] text-gray-400 line-clamp-2 mb-2 flex-1 leading-relaxed">{product.productDescription}</p>
        {pharmacy?.name && (
          <div className="mb-2.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2 space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">{pharmacy.name[0].toUpperCase()}</div><span className="text-[10px] text-gray-700 font-semibold truncate">{pharmacy.name}</span></div>
              <button onClick={() => onReviewClick(pharmacy)} className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-lg hover:bg-green-100 transition flex-shrink-0">Reviews</button>
            </div>
            {rating ? <div className="flex items-center gap-1.5"><Stars rating={Math.round(rating.averageRating)} /><span className="text-[10px] font-bold text-gray-700">{rating.averageRating.toFixed(1)}</span><span className="text-[10px] text-gray-400">({rating.totalCount})</span></div> : <p className="text-[10px] text-gray-400 italic">No reviews yet</p>}
          </div>
        )}
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-green-600 font-black text-[13px]">Rs. {product.productPrice?.toLocaleString()}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg ${outOfStock ? "bg-red-50 text-red-400" : "bg-gray-50 text-gray-400"}`}>{outOfStock ? "No stock" : `${product.productTotalStockQuantity} in stock`}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1 || outOfStock} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold">−</button>
            <span className="w-6 text-center text-[12px] font-bold text-gray-800">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.productTotalStockQuantity, q + 1))} disabled={qty >= product.productTotalStockQuantity || outOfStock} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold">+</button>
          </div>
          <button onClick={() => onAddToCart(product._id, qty, () => setQty(1))} disabled={adding || outOfStock}
            className={`flex-1 h-7 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : adding ? "bg-green-100 text-green-600" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
            {adding ? "Adding…" : outOfStock ? "Out of Stock" : "+ Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchMedicines() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [pharmacyRatings, setPharmacyRatings] = useState({});
  const [reviewModal, setReviewModal] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    Promise.allSettled([api.get("/products/get/products"), api.get("/cart/getcart")]).then(([prodRes, cartRes]) => {
      if (prodRes.status === "fulfilled") { const prods = toArr(prodRes.value.data); setProducts(prods); fetchPharmacyRatings(prods); }
      if (cartRes.status === "fulfilled") setCartCount(toArr(cartRes.value.data).length);
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPharmacyRatings = async (prods) => {
    const ids = [...new Set(prods.map(p => p.userId?._id).filter(Boolean))];
    const results = await Promise.allSettled(ids.map(id => api.get(`/reviews/pharmacy/${id}`)));
    const map = {};
    ids.forEach((id, i) => { if (results[i].status === "fulfilled") { const { averageRating, totalCount } = results[i].value.data; if (totalCount > 0) map[id] = { averageRating, totalCount }; } });
    setPharmacyRatings(map);
  };

  const handleReviewSubmitted = (pharmacyId, newReview) => {
    setPharmacyRatings(prev => { const existing = prev[pharmacyId] || { averageRating: 0, totalCount: 0 }; const newCount = existing.totalCount + 1; const newAvg = Math.round(((existing.averageRating * existing.totalCount + newReview.rating) / newCount) * 10) / 10; return { ...prev, [pharmacyId]: { averageRating: newAvg, totalCount: newCount } }; });
  };

  const handleAddToCart = async (productId, quantity, resetQty) => {
    setAdding(prev => ({ ...prev, [productId]: true }));
    try { await api.post("/cart/add", { productId, quantity }); setCartCount(c => c + 1); resetQty(); showToast("Added to cart!"); }
    catch (err) { showToast(err.response?.data?.message || "Failed to add to cart", "error"); }
    finally { setAdding(prev => ({ ...prev, [productId]: false })); }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { }
    localStorage.removeItem("user"); navigate("/login");
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(p => p.productName?.toLowerCase().includes(q) || p.productDescription?.toLowerCase().includes(q) || p.userId?.name?.toLowerCase().includes(q)); }
    if (stockFilter === "instock") r = r.filter(p => p.productTotalStockQuantity > 0);
    if (stockFilter === "outofstock") r = r.filter(p => p.productTotalStockQuantity === 0);
    if (sortBy === "newest") r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") r.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "price_asc") r.sort((a, b) => a.productPrice - b.productPrice);
    if (sortBy === "price_desc") r.sort((a, b) => b.productPrice - a.productPrice);
    if (sortBy === "name_asc") r.sort((a, b) => a.productName.localeCompare(b.productName));
    return r;
  }, [products, query, sortBy, stockFilter]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>{toast.msg}</div>}
      {reviewModal && <ReviewModal pharmacy={reviewModal} currentUserId={user?._id} onClose={() => setReviewModal(null)} onSubmitted={handleReviewSubmitted} />}
      <Topbar user={user} cartCount={cartCount} onLogout={handleLogout} navigate={navigate} />
      <main className="flex-1 px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-[22px] font-black text-gray-900 tracking-tight">Browse Medicines</h2><p className="text-gray-400 text-[13px] mt-0.5">{loading ? "Loading…" : `${filtered.length} of ${products.length} products`}</p></div>
          <button onClick={() => navigate("/user/cart")} className="relative flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-sm text-[13px] font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            View Cart
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold px-0.5">{cartCount}</span>}
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search medicines or pharmacy name…" value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition bg-gray-50/50" autoFocus />
            {query && <button onClick={() => setQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
          </div>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[120px]">
            <option value="all">All Stock</option><option value="instock">In Stock</option><option value="outofstock">Out of Stock</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[145px]">
            <option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="price_asc">Price: Low → High</option><option value="price_desc">Price: High → Low</option><option value="name_asc">Name: A → Z</option>
          </select>
        </div>
        {query && <div className="flex items-center gap-2"><span className="text-[13px] text-gray-400">Results for:</span><span className="bg-green-100 text-green-700 text-[13px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">"{query}"<button onClick={() => setQuery("")}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></span><span className="text-[13px] text-gray-400">— {filtered.length} found</span></div>}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"><div className="h-36 bg-gray-100" /><div className="p-3.5 space-y-2"><div className="h-3 bg-gray-100 rounded w-3/4" /><div className="h-2.5 bg-gray-100 rounded" /><div className="h-7 bg-gray-100 rounded-xl mt-3" /></div></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-24 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-1">No medicines found</h3>
            <p className="text-gray-400 text-[13px] mb-6">{query ? `No results for "${query}".` : "No products available yet."}</p>
            {query && <button onClick={() => setQuery("")} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Clear Search</button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(product => <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} adding={adding[product._id]} onReviewClick={setReviewModal} pharmacyRatings={pharmacyRatings} />)}
          </div>
        )}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}