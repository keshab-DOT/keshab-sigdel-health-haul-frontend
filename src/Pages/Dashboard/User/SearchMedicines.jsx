import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Topbar({ user, cartCount, onLogout, navigate }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Dashboard</button>
        <button onClick={() => navigate("/user/search")}    className="px-3.5 py-1.5 text-[13px] font-semibold text-gray-900 bg-gray-100 rounded-lg">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")}    className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
      </nav>
      <div className="flex-1 max-w-sm mx-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search medicines, categories…" className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition" onFocus={() => navigate("/user/search")} readOnly/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left"><p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p><p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p></div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
          </div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{["Search Medicines","My Orders","My Cart","Profile"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(t=><li key={t} className="hover:text-green-400 cursor-pointer transition-colors">{t}</li>)}</ul></div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
      {toast.msg}
    </div>
  );
}

function ProductCard({ product, onAddToCart, adding }) {
  const [qty, setQty] = useState(1);
  const outOfStock = product.productTotalStockQuantity === 0;
  const lowStock   = !outOfStock && product.productTotalStockQuantity <= 5;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden relative">
        {product.productImageUrl
          ? <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display = "none"; }}/>
          : <span className="text-5xl opacity-40">💊</span>}
        {outOfStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {lowStock && <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Only {product.productTotalStockQuantity} left</div>}
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <h4 className="font-bold text-gray-800 text-[12px] leading-snug mb-0.5 truncate">{product.productName}</h4>
        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">{product.productDescription}</p>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-green-600 font-black text-[13px]">Rs. {product.productPrice?.toLocaleString()}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg ${outOfStock ? "bg-red-50 text-red-400" : "bg-gray-50 text-gray-400"}`}>
            {outOfStock ? "No stock" : `${product.productTotalStockQuantity} in stock`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1 || outOfStock} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold">−</button>
            <span className="w-6 text-center text-[12px] font-bold text-gray-800">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.productTotalStockQuantity, q + 1))} disabled={qty >= product.productTotalStockQuantity || outOfStock} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition font-bold">+</button>
          </div>
          <button
            onClick={() => onAddToCart(product._id, qty, () => setQty(1))}
            disabled={adding || outOfStock}
            className={`flex-1 h-7 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1
              ${outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : adding ? "bg-green-100 text-green-600" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
            {adding ? "Adding…" : outOfStock ? "Out of Stock" : "+ Add to Cart"}
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
      showToast(err.response?.data?.message || "Failed to add to cart", "error");
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toast toast={toast}/>
      <Topbar user={user} cartCount={cartCount} onLogout={handleLogout} navigate={navigate}/>

      <main className="flex-1 px-8 py-6 space-y-5">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Browse Medicines</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">{loading ? "Loading…" : `${filtered.length} of ${products.length} products`}</p>
          </div>
          <button onClick={() => navigate("/user/cart")} className="relative flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-sm text-[13px] font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            View Cart
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold px-0.5">{cartCount}</span>}
          </button>
        </div>

        {/* Search & filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search medicines by name or description…" value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition bg-gray-50/50" autoFocus/>
            {query && (
              <button onClick={() => setQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[120px]">
            <option value="all">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 text-gray-600 min-w-[145px]">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name: A → Z</option>
          </select>
        </div>

        {query && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-400">Results for:</span>
            <span className="bg-green-100 text-green-700 text-[13px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
              "{query}"
              <button onClick={() => setQuery("")}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </span>
            <span className="text-[13px] text-gray-400">— {filtered.length} found</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-100"/>
                <div className="p-3.5 space-y-2"><div className="h-3 bg-gray-100 rounded w-3/4"/><div className="h-2.5 bg-gray-100 rounded"/><div className="h-7 bg-gray-100 rounded-xl mt-3"/></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-24 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-1">No medicines found</h3>
            <p className="text-gray-400 text-[13px] mb-6">{query ? `No results for "${query}". Try a different term.` : "No products available yet."}</p>
            {query && <button onClick={() => setQuery("")} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Clear Search</button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} adding={adding[product._id]}/>
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
}