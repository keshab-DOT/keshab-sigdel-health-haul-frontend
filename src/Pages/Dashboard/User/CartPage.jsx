import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  const links = [
    { key: "overview", label: "Overview", path: "/user/dashboard", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>) },
    { key: "cart", label: "My Cart", path: "/user/cart", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>) },
    { key: "orders", label: "My Orders", path: "/user/orders", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>) },
    { key: "profile", label: "Profile", path: "/user/profile", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>) },
    { key: "support", label: "Support", path: "/user/support", icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>) },
  ];
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/")}><h1 className="text-xl font-bold text-green-600">HealthHaul Nepal</h1><p className="text-xs text-gray-400 mt-0.5">Customer Portal</p></div>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="overflow-hidden"><p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Customer"}</p><p className="text-xs text-gray-400 truncate">{user?.email || ""}</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: "", phoneNumber: "", paymentMethod: "cod"
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/getcart");
      setCartItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await api.put(`/cart/update/cartitem/${id}`, { quantity: qty });
      setCartItems(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item));
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/remove/cartitem/${id}`);
      setCartItems(prev => prev.filter(item => item._id !== id));
      showToast("Item removed from cart");
    } catch (err) {
      showToast("Failed to remove item", "error");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear/cart");
      setCartItems([]);
      showToast("Cart cleared");
    } catch (err) {
      showToast("Failed to clear cart", "error");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutForm.shippingAddress.trim() || !checkoutForm.phoneNumber.trim()) {
      showToast("Please fill in all fields", "error"); return;
    }
    setCheckoutLoading(true);
    try {
      await api.post("/orders/checkout/cart", checkoutForm);
      setCartItems([]);
      setShowCheckout(false);
      showToast("Order placed successfully! 🎉");
      setTimeout(() => navigate("/user/orders"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Checkout failed", "error");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (e) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const total = cartItems.reduce((sum, item) => sum + (item.productId?.productPrice || 0) * item.quantity, 0);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="cart" user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>{toast.msg}</div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Complete Your Order</h3>
                <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleCheckout} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Address</label>
                  <textarea rows={3} placeholder="Enter your full delivery address"
                    value={checkoutForm.shippingAddress}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" placeholder="98XXXXXXXX"
                    value={checkoutForm.phoneNumber}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["cod", "khalti", "esewa"].map(method => (
                      <button key={method} type="button"
                        onClick={() => setCheckoutForm(prev => ({ ...prev, paymentMethod: method }))}
                        className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition capitalize ${
                          checkoutForm.paymentMethod === method
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-500 hover:border-green-300"
                        }`}>
                        {method === "cod" ? "Cash on Delivery" : method.charAt(0).toUpperCase() + method.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" disabled={checkoutLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition">
                  {checkoutLoading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
            <p className="text-gray-500 text-sm mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1.5 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear Cart
            </button>
          )}
        </div>

        <div className="px-8 py-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Add medicines from the dashboard to get started</p>
              <button onClick={() => navigate("/user/dashboard")}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Browse Medicines
              </button>
            </div>
          ) : (
            <div className="flex gap-6 items-start">
              {/* Cart Items */}
              <div className="flex-1 space-y-3">
                {cartItems.map(item => {
                  const product = item.productId;
                  return (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
                      <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product?.productImageUrl ? (
                          <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display = "none"; }} />
                        ) : <span className="text-2xl">💊</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{product?.productName || "Product"}</h4>
                        <p className="text-green-600 font-bold text-sm mt-0.5">Rs. {product?.productPrice?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{product?.productTotalStockQuantity} in stock</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating[item._id]}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-bold">−</button>
                        <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= product?.productTotalStockQuantity || updating[item._id]}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-bold">+</button>
                      </div>
                      <p className="font-bold text-gray-800 w-20 text-right">Rs. {((product?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 ml-2 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-500 truncate max-w-[140px]">{item.productId?.productName} × {item.quantity}</span>
                        <span className="font-medium text-gray-700">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-green-600">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
                    Proceed to Checkout →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}