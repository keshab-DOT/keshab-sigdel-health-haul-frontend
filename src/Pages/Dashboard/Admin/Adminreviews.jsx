import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AdminSidebar } from "./Admindashboard";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminReviews() {
  const navigate = useNavigate();
  const [admin, setAdmin]         = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterPharmacy, setFilterPharmacy] = useState("all");
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || "").toLowerCase();
    if (!stored || role !== "admin") { navigate("/login", { replace: true }); return; }
    setAdmin(stored);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/admin/all");
      setReviews(data.reviews || []);
    } catch {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Permanently delete this review?")) return;
    setDeleting(reviewId);
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      showToast("Review deleted.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete review", "error");
    } finally {
      setDeleting(null);
    }
  };

  const logout = () => { localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  // Unique pharmacies for filter dropdown
  const pharmacies = [...new Map(
    reviews.map(r => [r.pharmacyId?._id, r.pharmacyId])
  ).values()].filter(Boolean);

  // Stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
    : 0;
  const fiveStars = reviews.filter(r => r.rating === 5).length;
  const lowRatings = reviews.filter(r => r.rating <= 2).length;

  const filtered = reviews.filter(r => {
    const matchRating   = filterRating === "all" || r.rating === Number(filterRating);
    const matchPharmacy = filterPharmacy === "all" || r.pharmacyId?._id === filterPharmacy;
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.userId?.name?.toLowerCase().includes(q)
      || r.pharmacyId?.name?.toLowerCase().includes(q)
      || r.comment?.toLowerCase().includes(q);
    return matchRating && matchPharmacy && matchSearch;
  });

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
          {toast.msg}
        </div>
      )}

      {/* Pass active="reviews" — AdminSidebar will highlight it if it has that key */}
      <AdminSidebar active="reviews" navigate={navigate} onLogout={logout} admin={admin}/>

      <div className="pl-[220px]">
        <main className="px-8 py-7 min-h-screen">

          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">All Reviews</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Customer reviews across all pharmacies</p>
            </div>
            <button onClick={fetchReviews}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
            {[
              { label: "Total Reviews",  value: totalReviews,           color: "text-gray-900",   bg: "bg-gray-50"   },
              { label: "Average Rating", value: avgRating > 0 ? `${avgRating} / 5` : "—", color: "text-amber-600",  bg: "bg-amber-50"  },
              { label: "5-Star Reviews", value: fiveStars,              color: "text-green-600",  bg: "bg-green-50"  },
              { label: "Low Ratings (≤2)", value: lowRatings,           color: "text-red-600",    bg: "bg-red-50"    },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} px-6 py-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex flex-col sm:flex-row gap-2.5 mb-5">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search by customer, pharmacy, or comment…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition bg-gray-50/50"/>
              {search && <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>}
            </div>
            <select value={filterPharmacy} onChange={e => setFilterPharmacy(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[170px]">
              <option value="all">All Pharmacies</option>
              {pharmacies.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={filterRating} onChange={e => setFilterRating(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[140px]">
              <option value="all">All Ratings</option>
              {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Star{s !== 1 ? "s" : ""}</option>)}
            </select>
          </div>

          {/* Reviews table */}
          {loading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-9 h-9 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-[15px] font-bold text-gray-700">No reviews found</p>
              <p className="text-[13px] text-gray-400 mt-1">{search ? "Try clearing your search" : "No reviews match the selected filters"}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3 grid grid-cols-[1.2fr_1.2fr_0.8fr_1.8fr_100px_40px] gap-3 items-center">
                {["CUSTOMER", "PHARMACY", "RATING", "COMMENT", "DATE", ""].map(col => (
                  <p key={col} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col}</p>
                ))}
              </div>

              <div className="divide-y divide-gray-50">
                {filtered.map(review => (
                  <div key={review._id} className="px-5 py-4 grid grid-cols-[1.2fr_1.2fr_0.8fr_1.8fr_100px_40px] gap-3 items-center hover:bg-gray-50/40 transition-colors">

                    {/* Customer */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
                        {review.userId?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-gray-800 truncate">{review.userId?.name || "User"}</p>
                        <p className="text-[10px] text-gray-400 truncate">{review.userId?.email || ""}</p>
                      </div>
                    </div>

                    {/* Pharmacy */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">
                        {review.pharmacyId?.name?.[0]?.toUpperCase() || "P"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-gray-800 truncate">{review.pharmacyId?.name || "Pharmacy"}</p>
                        <p className="text-[10px] text-gray-400 truncate">{review.pharmacyId?.email || ""}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-1">
                      <Stars rating={review.rating}/>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold w-fit
                        ${review.rating >= 4 ? "bg-green-50 text-green-700"
                        : review.rating === 3 ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-600"}`}>
                        {review.rating}/5
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">
                      {review.comment || <span className="text-gray-300 italic">No comment</span>}
                    </p>

                    {/* Date */}
                    <div>
                      <p className="text-[12px] text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[10px] text-gray-400">{timeAgo(review.createdAt)}</p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={deleting === review._id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40"
                      title="Delete review">
                      {deleting === review._id
                        ? <svg className="animate-spin w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                    </button>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 rounded-b-2xl">
                <p className="text-[12px] text-gray-400">{filtered.length} of {totalReviews} reviews shown</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}