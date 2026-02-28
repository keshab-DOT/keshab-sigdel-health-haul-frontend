import { useState, useEffect } from "react";
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
        <button onClick={() => navigate("/user/search")}    className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")}    className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
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

function Footer({ navigate }) {
  const quickLinks = [
    { label: "Search Medicines", path: "/user/search" },
    { label: "My Orders",        path: "/user/orders" },
    { label: "My Cart",          path: "/user/cart" },
    { label: "Profile",          path: "/user/profile" },
  ];
  const supportLinks = [
    { label: "Help Center",      path: "/user/support" },
    { label: "Contact Us",       path: "/user/support" },
    { label: "Refund Policy",    path: "/user/support" },
    { label: "Terms of Service", path: "/user/support" },
  ];
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {quickLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {supportLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
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

export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast]         = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ shippingAddress: "", phoneNumber: "", paymentMethod: "cod" });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/cart/getcart").then(r => setCartItems(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    setUpdating(p => ({ ...p, [id]: true }));
    try {
      await api.put(`/cart/update/cartitem/${id}`, { quantity: qty });
      setCartItems(p => p.map(item => item._id === id ? { ...item, quantity: qty } : item));
    } catch (err) { showToast(err.response?.data?.message || "Update failed", "error"); }
    finally { setUpdating(p => ({ ...p, [id]: false })); }
  };

  const removeItem = async (id) => {
    try { await api.delete(`/cart/remove/cartitem/${id}`); setCartItems(p => p.filter(i => i._id !== id)); showToast("Item removed"); }
    catch { showToast("Failed to remove item", "error"); }
  };

  const clearCart = async () => {
    try { await api.delete("/cart/clear/cart"); setCartItems([]); showToast("Cart cleared"); }
    catch { showToast("Failed to clear cart", "error"); }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutForm.shippingAddress.trim() || !checkoutForm.phoneNumber.trim()) { showToast("Please fill in all fields", "error"); return; }
    setCheckoutLoading(true);
    try {
      await api.post("/orders/checkout/cart", checkoutForm);
      setCartItems([]);
      setShowCheckout(false);
      showToast("Order placed successfully! 🎉");
      setTimeout(() => navigate("/user/orders"), 1500);
    } catch (err) { showToast(err.response?.data?.message || "Checkout failed", "error"); }
    finally { setCheckoutLoading(false); }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user"); navigate("/login");
  };

  const total = cartItems.reduce((s, i) => s + (i.productId?.productPrice || 0) * i.quantity, 0);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400 text-sm">Loading your cart…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>{toast.msg}</div>}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-black text-gray-900">Complete Your Order</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Fill in your delivery details</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Shipping Address</label>
                <textarea rows={3} placeholder="Enter your full delivery address" value={checkoutForm.shippingAddress} onChange={e => setCheckoutForm(p => ({ ...p, shippingAddress: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 resize-none bg-gray-50/50 transition" required/>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" placeholder="98XXXXXXXX" value={checkoutForm.phoneNumber} onChange={e => setCheckoutForm(p => ({ ...p, phoneNumber: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-gray-50/50 transition" required/>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ val: "cod", short: "Cash on Delivery" }, { val: "esewa", short: "eSewa" }].map(({ val, short }) => (
                    <button key={val} type="button" onClick={() => setCheckoutForm(p => ({ ...p, paymentMethod: val }))}
                      className={`py-2.5 px-3 rounded-xl border-2 text-[12px] font-semibold transition-all text-center ${checkoutForm.paymentMethod === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-green-300"}`}>
                      {short}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-[13px]">Total Amount</span>
                <span className="text-xl font-black text-green-600">Rs. {total.toLocaleString()}</span>
              </div>
              <button type="submit" disabled={checkoutLoading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-black hover:bg-gray-800 disabled:opacity-50 transition text-[13px]">
                {checkoutLoading ? "Placing Order…" : "Place Order →"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Topbar user={user} cartCount={cartItems.length} onLogout={handleLogout} navigate={navigate}/>

      <main className="flex-1 px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">My Cart</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/user/search")} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3.5 py-2 rounded-xl hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition text-[13px] font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add More
            </button>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3.5 py-2 rounded-xl hover:bg-red-50 transition text-[13px] font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Clear
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 text-[13px] mb-6">Search for medicines and add them to your cart</p>
            <button onClick={() => navigate("/user/search")} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Search Medicines →</button>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            <div className="flex-1 space-y-2.5">
              {cartItems.map(item => {
                const p = item.productId;
                return (
                  <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-green-100">
                      {p?.productImageUrl
                        ? <img src={p.productImageUrl} alt={p.productName} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display = "none"; }}/>
                        : <span className="text-2xl">💊</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-[13px] truncate">{p?.productName || "Product"}</h4>
                      <p className="text-green-600 font-black text-[13px] mt-0.5">Rs. {p?.productPrice?.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{p?.productTotalStockQuantity} in stock</p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating[item._id]} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold text-base transition">−</button>
                      <span className="w-8 text-center font-black text-gray-800 text-[13px]">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= p?.productTotalStockQuantity || updating[item._id]} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold text-base transition">+</button>
                    </div>
                    <p className="font-black text-gray-800 w-24 text-right text-[13px]">Rs. {((p?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item._id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="w-72 flex-shrink-0 sticky top-20">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-[15px] font-black text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between text-[12px]">
                      <span className="text-gray-500 truncate max-w-[130px]">{item.productId?.productName} × {item.quantity}</span>
                      <span className="font-semibold text-gray-700 flex-shrink-0 ml-2">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-gray-800 text-[13px]">Total</span>
                    <span className="text-xl font-black text-green-600">Rs. {total.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Delivery charges may apply</p>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 transition mb-2 text-[13px]">Checkout →</button>
                <button onClick={() => navigate("/user/search")} className="w-full border border-gray-200 text-gray-500 py-2 rounded-xl text-[12px] font-medium hover:bg-gray-50 transition">Continue Shopping</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer navigate={navigate}/>
    </div>
  );
}