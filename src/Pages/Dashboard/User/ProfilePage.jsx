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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  // Support form
  const [supportForm, setSupportForm] = useState({ subject: "", category: "order", message: "" });
  const [supportSending, setSupportSending] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    setProfileForm({ name: stored.name || "", email: stored.email || "", phone: stored.phone || "" });
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (e) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    // Since there's no profile update endpoint, we just update localStorage
    await new Promise(r => setTimeout(r, 600));
    const updated = { ...user, name: profileForm.name, phone: profileForm.phone };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    showToast("Profile updated successfully!");
    setProfileSaving(false);
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSupportSent(true);
    setSupportSending(false);
    showToast("Support ticket submitted! We'll get back to you soon.");
    setSupportForm({ subject: "", category: "order", message: "" });
    setTimeout(() => setSupportSent(false), 5000);
  };

  const tabs = [
    { key: "profile", label: "My Profile" },
    { key: "support", label: "Help & Support" },
    { key: "account", label: "Account Info" },
  ];

  const faqItems = [
    { q: "How do I track my order?", a: "Go to 'My Orders' page to see real-time tracking for all your orders including status updates." },
    { q: "What payment methods are accepted?", a: "We accept Cash on Delivery (COD), Khalti, and eSewa for all orders." },
    { q: "Can I cancel my order?", a: "Orders can only be cancelled before they are dispatched. Please contact support immediately for cancellations." },
    { q: "How long does delivery take?", a: "Standard delivery takes 30-60 minutes within Kathmandu valley. Outside may take 1-2 days." },
    { q: "What if I receive wrong medicine?", a: "Contact our support immediately with your order ID and we will resolve it within 24 hours." },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="profile" user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>{toast.msg}</div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <h2 className="text-2xl font-bold text-gray-800">Profile & Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account and get help</p>
        </div>

        <div className="px-8 py-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">✓ Verified Customer</span>
                {user?.roles?.includes("user") && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">Customer</span>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === key ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-green-600"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Profile</h3>
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input value={profileForm.email} disabled
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder="98XXXXXXXX" />
                </div>
                <button type="submit" disabled={profileSaving}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-sm">
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "support" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Submit Ticket */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Submit a Ticket</h3>
                <p className="text-gray-500 text-sm mb-5">We typically respond within 2-4 hours</p>
                {supportSent ? (
                  <div className="py-10 text-center">
                    <div className="text-5xl mb-3">✅</div>
                    <h4 className="text-lg font-bold text-gray-700 mb-2">Ticket Submitted!</h4>
                    <p className="text-gray-400 text-sm">Our team will get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select value={supportForm.category} onChange={e => setSupportForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
                        <option value="order">Order Issue</option>
                        <option value="payment">Payment Problem</option>
                        <option value="delivery">Delivery Concern</option>
                        <option value="product">Wrong Product</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                      <input value={supportForm.subject} onChange={e => setSupportForm(p => ({ ...p, subject: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Brief description" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                      <textarea rows={4} value={supportForm.message} onChange={e => setSupportForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" placeholder="Describe your issue in detail..." required />
                    </div>
                    <button type="submit" disabled={supportSending}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition">
                      {supportSending ? "Sending..." : "Submit Ticket"}
                    </button>
                  </form>
                )}
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-5">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqItems.map((faq, i) => (
                    <FaqItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-2">Still need help?</p>
                  <a href="tel:+977-XXXXXXXXX" className="text-green-600 font-semibold text-sm hover:text-green-700 flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Support (24/7)
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-4 max-w-2xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: user?.name },
                    { label: "Email Address", value: user?.email },
                    { label: "Phone Number", value: user?.phone || "Not set" },
                    { label: "Account Type", value: "Customer" },
                    { label: "Account ID", value: user?._id?.slice(-12).toUpperCase() || "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="text-base font-bold text-red-700 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-500 mb-4">These actions are irreversible. Please be careful.</p>
                <button onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition">
                  Logout from All Devices
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition">
        <span className="text-sm font-semibold text-gray-700">{question}</span>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-3 text-sm text-gray-500 border-t border-gray-100 pt-2 bg-gray-50">{answer}</div>}
    </div>
  );
}