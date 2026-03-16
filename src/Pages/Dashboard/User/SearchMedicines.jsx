import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const toArr = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products))   return data.products;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.data))       return data.data;
  return [];
};


const TYPE_META_N={ORDER_PLACED:{icon:"📦",color:"bg-blue-50 text-blue-600"},ORDER_STATUS:{icon:"🚚",color:"bg-green-50 text-green-600"},PAYMENT_SUCCESS:{icon:"💰",color:"bg-amber-50 text-amber-600"}};
const notifMetaN=(type)=>TYPE_META_N[type]||{icon:"🔔",color:"bg-gray-50 text-gray-600"};
function timeAgoN(date){const diff=Math.floor((Date.now()-new Date(date))/1000);if(diff<60)return"just now";if(diff<3600)return`${Math.floor(diff/60)}m ago`;if(diff<86400)return`${Math.floor(diff/3600)}h ago`;return`${Math.floor(diff/86400)}d ago`;}
function NotificationBell({userId}){const[open,setOpen]=useState(false);const[notifs,setNotifs]=useState([]);const[unread,setUnread]=useState(0);const[loading,setLoading]=useState(true);const dropdownRef=useRef(null);const socketRef=useRef(null);const fetchNotifs=useCallback(async()=>{try{const{data}=await api.get("/notifications");setNotifs(data.notifications||[]);setUnread(data.unreadCount||0);}catch{}finally{setLoading(false);};},[]);useEffect(()=>{fetchNotifs();},[fetchNotifs]);useEffect(()=>{if(!userId)return;const socket=io("http://localhost:3000",{query:{userId},withCredentials:true});socketRef.current=socket;socket.emit("joinUserRoom",userId);socket.on("newNotification",(n)=>{setNotifs(prev=>prev.some(x=>x._id===n._id)?prev:[n,...prev]);setUnread(prev=>prev+1);});return()=>{socket.emit("leaveUserRoom",userId);socket.disconnect();};},[userId]);useEffect(()=>{const h=(e)=>{if(dropdownRef.current&&!dropdownRef.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);const markRead=async(id)=>{try{await api.put(`/notifications/${id}/read`);setNotifs(prev=>prev.map(n=>n._id===id?{...n,isRead:true}:n));setUnread(prev=>Math.max(0,prev-1));}catch{}};const markAllRead=async(e)=>{e.stopPropagation();try{await api.put("/notifications/read-all");setNotifs(prev=>prev.map(n=>({...n,isRead:true})));setUnread(0);}catch{}};return(<div className="relative flex-shrink-0" ref={dropdownRef}><button onClick={()=>setOpen(o=>!o)} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition" title="Notifications"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>{unread>0&&<span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-[3px] leading-none">{unread>9?"9+":unread}</span>}</button>{open&&(<div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"><div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"><div className="flex items-center gap-2"><p className="text-[14px] font-black text-gray-900">Notifications</p>{unread>0&&<span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}</div>{unread>0&&<button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}</div><div className="max-h-[380px] overflow-y-auto">{loading?(<div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/></div>):notifs.length===0?(<div className="py-12 text-center"><div className="text-3xl mb-2">🔔</div><p className="text-[13px] font-bold text-gray-600">No notifications yet</p></div>):notifs.slice(0,20).map(n=>{const m=notifMetaN(n.type);return(<button key={n._id} onClick={()=>{if(!n.isRead)markRead(n._id);setOpen(false);}} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead?"bg-green-50/40":""}`}><div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div><div className="flex-1 min-w-0"><p className={`text-[12px] leading-snug ${n.isRead?"text-gray-700 font-medium":"text-gray-900 font-bold"}`}>{n.title}</p><p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p><p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p></div>{!n.isRead&&<div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5"/>}</button>);})}</div></div>)}</div>);}

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
        <button onClick={() => navigate("/user/chat")}      className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Chat</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <NotificationBell userId={user?._id} />
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

function Footer({ navigate }) {
  const quickLinks   = [{ label: "Search Medicines", path: "/user/search" }, { label: "My Orders", path: "/user/orders" }, { label: "My Cart", path: "/user/cart" }, { label: "Profile", path: "/user/profile" }];
  const supportLinks = [{ label: "Help Center", path: "/user/support" }, { label: "Contact Us", path: "/user/support" }, { label: "Refund Policy", path: "/user/support" }, { label: "Terms of Service", path: "/user/support" }];
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">{quickLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>))}</ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">{supportLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>))}</ul>
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

// ── Product Card with Pharmacy Info ───────────────────────────────────────────
function ProductCard({ product, onAddToCart, adding }) {
  const [qty, setQty]       = useState(1);
  const [showPharmacy, setShowPharmacy] = useState(false);

  const outOfStock = product.productTotalStockQuantity === 0;
  const lowStock   = !outOfStock && product.productTotalStockQuantity <= 5;
  const catName    = product.categoryId?.categoryName || null;
  const pharmacy   = product.userId; // populated: { name, email }

  const imgSrc = product.productImageUrl
    ? product.productImageUrl.startsWith("http")
      ? product.productImageUrl
      : `http://localhost:3000/${product.productImageUrl}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Image */}
      <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden relative">
        {imgSrc
          ? <img src={imgSrc} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display = "none"; }}/>
          : <span className="text-5xl opacity-40">💊</span>}
        {outOfStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {lowStock && <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Only {product.productTotalStockQuantity} left</div>}
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        {/* Category */}
        {catName && (
          <span className="inline-block mb-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 self-start">{catName}</span>
        )}

        <h4 className="font-bold text-gray-800 text-[12px] leading-snug mb-0.5 truncate">{product.productName}</h4>
        <p className="text-[10px] text-gray-400 line-clamp-2 mb-2 flex-1 leading-relaxed">{product.productDescription}</p>

        {/* Pharmacy info row */}
        {pharmacy?.name && (
          <div className="mb-2.5">
            <button
              onClick={() => setShowPharmacy(p => !p)}
              className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold bg-green-50 border border-green-100 px-2 py-1 rounded-lg hover:bg-green-100 transition w-full">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">
                {pharmacy.name[0].toUpperCase()}
              </div>
              <span className="truncate">{pharmacy.name}</span>
              <svg className={`w-3 h-3 ml-auto flex-shrink-0 transition-transform ${showPharmacy ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {showPharmacy && (
              <div className="mt-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 space-y-1">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  <p className="text-[10px] font-bold text-gray-700 truncate">{pharmacy.name}</p>
                </div>
                {pharmacy.email && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <p className="text-[10px] text-gray-400 truncate">{pharmacy.email}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
  const [user,        setUser]        = useState(null);
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [cartCount,   setCartCount]   = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [adding,      setAdding]      = useState({});
  const [toast,       setToast]       = useState(null);
  const [query,       setQuery]       = useState("");
  const [sortBy,      setSortBy]      = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [catFilter,   setCatFilter]   = useState("all");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    Promise.allSettled([
      api.get("/products/get/products"),
      api.get("/cart/getcart"),
      api.get("/categories/"),
    ]).then(([prodRes, cartRes, catRes]) => {
      if (prodRes.status === "fulfilled") setProducts(toArr(prodRes.value.data));
      if (cartRes.status === "fulfilled") setCartCount(toArr(cartRes.value.data).length);
      if (catRes.status  === "fulfilled") setCategories(toArr(catRes.value.data));
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = async (productId, quantity, resetQty) => {
    setAdding(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity });
      setCartCount(c => c + 1);
      resetQty();
      showToast("Added to cart!");
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
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(p =>
        p.productName?.toLowerCase().includes(q) ||
        p.productDescription?.toLowerCase().includes(q) ||
        p.userId?.name?.toLowerCase().includes(q)
      );
    }
    if (catFilter !== "all") r = r.filter(p => (p.categoryId?._id || p.categoryId) === catFilter);
    if (stockFilter === "instock")    r = r.filter(p => p.productTotalStockQuantity > 0);
    if (stockFilter === "outofstock") r = r.filter(p => p.productTotalStockQuantity === 0);
    if (sortBy === "newest")     r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")     r.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "price_asc")  r.sort((a, b) => a.productPrice - b.productPrice);
    if (sortBy === "price_desc") r.sort((a, b) => b.productPrice - a.productPrice);
    if (sortBy === "name_asc")   r.sort((a, b) => a.productName.localeCompare(b.productName));
    return r;
  }, [products, query, sortBy, stockFilter, catFilter]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      <Topbar user={user} cartCount={cartCount} onLogout={handleLogout} navigate={navigate}/>

      <main className="flex-1 px-8 py-6 space-y-5">
        {/* Header */}
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
            <input type="text" placeholder="Search medicines or pharmacy name…" value={query} onChange={e => setQuery(e.target.value)}
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

        {/* Category filter pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCatFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${catFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600"}`}>
              All Categories
            </button>
            {categories.map(cat => (
              <button key={cat._id} onClick={() => setCatFilter(cat._id)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold border transition-all flex items-center gap-1.5 ${catFilter === cat._id ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600"}`}>
                {cat.categoryImageUrl && (
                  <img src={cat.categoryImageUrl.startsWith("http") ? cat.categoryImageUrl : `http://localhost:3000/${cat.categoryImageUrl}`}
                    alt="" className="w-4 h-4 rounded object-cover"/>
                )}
                {cat.categoryName}
              </button>
            ))}
          </div>
        )}

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

        {/* Grid */}
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
            {(query || catFilter !== "all") && (
              <button onClick={() => { setQuery(""); setCatFilter("all"); }} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Clear Filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} adding={adding[product._id]}/>
            ))}
          </div>
        )}
      </main>
      <Footer navigate={navigate}/>
    </div>
  );
}