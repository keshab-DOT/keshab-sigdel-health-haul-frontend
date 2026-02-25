import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",   label: "Search Medicines", path: "/user/search",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",     label: "My Cart",          path: "/user/cart",     icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",   label: "My Orders",        path: "/user/orders",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile",  label: "Profile",          path: "/user/profile",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { key: "settings", label: "Settings",         path: "/user/settings", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
];

function Sidebar({ active, user, onLogout, cartCount = 0 }) {
  const navigate = useNavigate();
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-[11px] font-black">HH</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">HealthHaul Nepal</h1>
            <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Customer Portal</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-green-50/80 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Customer"}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 relative
              ${active === key ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-200/60" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
            {label}
            {key === "cart" && cartCount > 0 && (
              <span className="absolute right-3 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
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

function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><span className="text-white text-[10px] font-black">HH</span></div>
              <h4 className="font-bold text-green-400 text-base">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your trusted partner for fast, reliable medicine delivery across Nepal.</p>
            <div className="flex flex-wrap gap-2 mt-4">{["Licensed Pharmacies","30-min Delivery","Secure Payment"].map(t=><span key={t} className="bg-gray-800/80 text-gray-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-700/50">{t}</span>)}</div>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Search Medicines","My Orders","My Cart","Profile"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex justify-between items-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
      {toast.type === "error"
        ? <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
        : <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
      {toast.msg}
    </div>
  );
}

function ProductCard({ product, onAddToCart, adding }) {
  const [qty, setQty] = useState(1);
  const outOfStock = product.productTotalStockQuantity === 0;
  const lowStock   = !outOfStock && product.productTotalStockQuantity <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group">
      <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden relative">
        {product.productImageUrl
          ? <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display = "none"; }}/>
          : <span className="text-5xl opacity-60">💊</span>}
        {outOfStock && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow">Out of Stock</span>
          </div>
        )}
        {lowStock && !outOfStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
            Only {product.productTotalStockQuantity} left!
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-gray-800 text-[13px] leading-snug mb-1">{product.productName}</h4>
        <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">{product.productDescription}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-green-600 font-black text-base tracking-tight">Rs. {product.productPrice?.toLocaleString()}</p>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${outOfStock ? "bg-red-50 text-red-400" : "bg-gray-50 text-gray-400"}`}>
            {outOfStock ? "No stock" : `${product.productTotalStockQuantity} in stock`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1 || outOfStock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold text-base">−</button>
            <span className="w-7 text-center text-[13px] font-bold text-gray-800">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.productTotalStockQuantity, q + 1))}
              disabled={qty >= product.productTotalStockQuantity || outOfStock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold text-base">+</button>
          </div>
          <button
            onClick={() => onAddToCart(product._id, qty, () => setQty(1))}
            disabled={adding || outOfStock}
            className={`flex-1 h-8 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5
              ${outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : adding ? "bg-green-100 text-green-600"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm active:scale-95"}`}
          >
            {adding
              ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding…</>
              : outOfStock ? "Out of Stock"
              : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchMedicines() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState({});
  const [toast, setToast]       = useState(null);
  const [query, setQuery]       = useState("");
  const [sortBy, setSortBy]     = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/products/get/products").then(r => setProducts(r.data || [])).catch(() => {}).finally(() => setLoading(false));
    api.get("/cart/getcart").then(r => setCartCount(r.data?.length || 0)).catch(() => {});
  }, []);

  const handleAddToCart = async (productId, quantity, resetQty) => {
    setAdding(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity });
      setCartCount(c => c + 1);
      resetQty();
      showToast("Added to cart! 🛒");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        showToast("Session expired. Redirecting…", "error");
        setTimeout(() => { localStorage.removeItem("user"); navigate("/login"); }, 1500);
      } else {
        showToast(err.response?.data?.message || "Failed to add to cart", "error");
      }
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(p => p.productName?.toLowerCase().includes(q) || p.productDescription?.toLowerCase().includes(q)); }
    if (stockFilter === "instock")    r = r.filter(p => p.productTotalStockQuantity > 0);
    if (stockFilter === "outofstock") r = r.filter(p => p.productTotalStockQuantity === 0);
    if (sortBy === "newest")     r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")     r.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "price_asc")  r.sort((a, b) => a.productPrice - b.productPrice);
    if (sortBy === "price_desc") r.sort((a, b) => b.productPrice - a.productPrice);
    if (sortBy === "name_asc")   r.sort((a, b) => a.productName.localeCompare(b.productName));
    return r;
  }, [products, query, sortBy, stockFilter]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="search" user={user} onLogout={handleLogout} cartCount={cartCount} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Toast toast={toast} />

        <header className="bg-white border-b border-gray-100 px-7 py-4 flex justify-between items-center sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Search Medicines</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
            </p>
          </div>
          <button onClick={() => navigate("/user/cart")}
            className="relative flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3.5 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm shadow-green-200 text-[13px] font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            View Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold px-0.5">{cartCount}</span>
            )}
          </button>
        </header>

        <main className="flex-1 px-7 py-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3.5 mb-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input type="text" placeholder="Search medicines by name or description…" value={query} onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition bg-gray-50/50" autoFocus/>
              {query && (
                <button onClick={() => setQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 bg-gray-50/50 text-gray-600 cursor-pointer min-w-[120px]">
              <option value="all">All Stock</option>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/50 bg-gray-50/50 text-gray-600 cursor-pointer min-w-[145px]">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
            </select>
          </div>

          {query && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px] text-gray-400">Results for:</span>
              <span className="bg-green-100 text-green-700 text-[13px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                "{query}"
                <button onClick={() => setQuery("")}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </span>
              <span className="text-[13px] text-gray-400">— {filtered.length} found</span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100"/>
                  <div className="p-4 space-y-3">
                    <div className="h-3.5 bg-gray-100 rounded-lg w-3/4"/>
                    <div className="h-3 bg-gray-100 rounded-lg w-full"/>
                    <div className="h-3 bg-gray-100 rounded-lg w-2/3"/>
                    <div className="h-8 bg-gray-100 rounded-xl mt-4"/>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-gray-700 mb-1.5">No medicines found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {query ? `No results for "${query}". Try a different term.` : "No products available yet."}
              </p>
              {query && (
                <button onClick={() => setQuery("")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition text-sm">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} adding={adding[product._id]} />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}