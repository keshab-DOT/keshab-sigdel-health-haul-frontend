import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <h1 className="text-xl font-bold text-green-600">HealthHaul Nepal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Customer Portal</p>
      </div>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="overflow-hidden"><p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Customer"}</p><p className="text-xs text-gray-400 truncate">{user?.email || ""}</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h4 className="font-bold text-green-400 text-lg mb-3">HealthHaul Nepal</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your trusted partner for fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Licensed Pharmacies", "30-min Delivery", "Secure Payment"].map(t => (
                <span key={t} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Search Medicines","My Orders","My Cart","Profile"].map(l=><li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>)}</ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{["Help Center","Contact Us","Refund Policy","Terms of Service"].map(l=><li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>)}</ul>
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
      setCartItems([]); setShowCheckout(false);
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
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="cart" user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-h-screen">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>{toast.msg}</div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Complete Your Order</h3>
                <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleCheckout} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Address</label>
                  <textarea rows={3} placeholder="Enter your full delivery address"
                    value={checkoutForm.shippingAddress}
                    onChange={e => setCheckoutForm(p => ({ ...p, shippingAddress: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" required/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" placeholder="98XXXXXXXX" value={checkoutForm.phoneNumber}
                    onChange={e => setCheckoutForm(p => ({ ...p, phoneNumber: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" required/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ val: "cod", label: "Cash on\nDelivery" }, { val: "khalti", label: "Khalti" }, { val: "esewa", label: "eSewa" }].map(({ val, label }) => (
                      <button key={val} type="button" onClick={() => setCheckoutForm(p => ({ ...p, paymentMethod: val }))}
                        className={`py-3 rounded-xl border-2 text-xs font-semibold transition whitespace-pre-line leading-tight ${checkoutForm.paymentMethod === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-green-300"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-gray-700 font-semibold text-sm">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">Rs. {total.toLocaleString()}</span>
                </div>
                <button type="submit" disabled={checkoutLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-md">
                  {checkoutLoading ? "Placing Order..." : "Place Order →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
            <p className="text-gray-500 text-sm mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/user/search")}
              className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2.5 rounded-xl hover:bg-green-50 transition font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add More
            </button>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="flex items-center gap-1.5 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 transition text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <main className="flex-1 px-8 py-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Search for medicines and add them to your cart</p>
              <button onClick={() => navigate("/user/search")}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Search Medicines →
              </button>
            </div>
          ) : (
            <div className="flex gap-6 items-start">
              {/* Items list */}
              <div className="flex-1 space-y-3">
                {cartItems.map(item => {
                  const p = item.productId;
                  return (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
                      <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p?.productImageUrl ? <img src={p.productImageUrl} alt={p.productName} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display = "none"; }}/> : <span className="text-2xl">💊</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{p?.productName || "Product"}</h4>
                        <p className="text-green-600 font-bold text-sm mt-0.5">Rs. {p?.productPrice?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p?.productTotalStockQuantity} in stock</p>
                      </div>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating[item._id]}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 font-bold text-lg transition">−</button>
                        <span className="w-9 text-center font-semibold text-gray-800 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= p?.productTotalStockQuantity || updating[item._id]}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 font-bold text-lg transition">+</button>
                      </div>
                      <p className="font-bold text-gray-800 w-24 text-right">Rs. {((p?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition ml-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="w-72 flex-shrink-0 sticky top-24">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-2.5 mb-4 max-h-52 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-500 truncate max-w-[140px]">{item.productId?.productName} × {item.quantity}</span>
                        <span className="font-medium text-gray-700 flex-shrink-0 ml-2">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-4 mb-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-green-600">Rs. {total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">Delivery charges may apply</p>
                  </div>
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md mb-2">
                    Proceed to Checkout →
                  </button>
                  <button onClick={() => navigate("/user/search")}
                    className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}