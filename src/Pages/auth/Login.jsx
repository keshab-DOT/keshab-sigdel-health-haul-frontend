import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const getRole = (roles) => {
  const raw = Array.isArray(roles) ? roles[0] : roles;
  return (raw || "").toLowerCase().trim();
};

const redirectByRole = (roles, navigate) => {
  const role = getRole(roles);
  if (role === "pharmacy") navigate("/pharmacy/dashboard", { replace: true });
  else if (role === "admin") navigate("/admin/dashboard", { replace: true });
  else navigate("/user/dashboard", { replace: true });
};

function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);

  const step1 = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("OTP sent! Check your email.");
      setTimeout(() => { setSuccess(""); setStep(2); }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const step2 = (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 4) { setError("Enter the 4-digit OTP"); return; }
    setStep(3);
  };

  const step3 = async (e) => {
    e.preventDefault();
    setError("");
    if (newPass.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPass !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, code: otp, newPassword: newPass, confirmPassword: confirm });
      setSuccess("Password reset successfully! You can now log in.");
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  const STEPS = ["Email", "Verify OTP", "New Password"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden mx-4">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900">Forgot Password</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Reset your HealthHaul account password</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5">
          <div className="flex items-center">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black flex-shrink-0 transition-all ${i + 1 < step ? "bg-green-500 text-white" : i + 1 === step ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <div className="ml-1 flex-shrink-0 hidden sm:block">
                  <p className={`text-[10px] font-semibold ${i + 1 <= step ? "text-gray-700" : "text-gray-300"}`}>{label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full ${i + 1 < step ? "bg-green-400" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-[13px] font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-[13px] font-medium">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={step1} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">Your Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full border border-gray-200 rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">We'll send a 4-digit OTP to this email</p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs sm:text-[13px] hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</>
                ) : "Send Reset OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={step2} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">Enter OTP</label>
                <input
                  type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="4-digit code" maxLength={4} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg sm:text-[18px] font-black tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Sent to <span className="font-semibold text-gray-600">{email}</span></p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-xs sm:text-[13px] hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button type="submit"
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs sm:text-[13px] hover:bg-gray-800 transition">
                  Verify OTP →
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError(""); setLoading(true);
                  api.post("/auth/forgot-password", { email })
                    .then(() => { setSuccess("OTP resent!"); setTimeout(() => setSuccess(""), 2000); })
                    .catch(err => setError(err.response?.data?.message || "Failed to resend"))
                    .finally(() => setLoading(false));
                }}
                disabled={loading}
                className="w-full text-xs text-green-600 hover:text-green-700 font-semibold text-center disabled:opacity-50"
              >
                {loading ? "Sending…" : "Resend OTP"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={step3} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPw ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)}
                    placeholder="Min. 6 characters" required
                    className="w-full border border-gray-200 rounded-xl pl-9 sm:pl-10 pr-10 py-2.5 text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition"
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <svg className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <input
                    type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter new password" required
                    className="w-full border border-gray-200 rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 transition"
                  />
                </div>
              </div>
              {confirm && (
                <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${newPass === confirm ? "text-green-600" : "text-red-500"}`}>
                  {newPass === confirm ? (
                    <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Passwords match</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Passwords do not match</>
                  )}
                </div>
              )}
              <button type="submit" disabled={loading || newPass !== confirm}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold text-xs sm:text-[13px] hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Resetting…</>
                ) : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.roles) return;
    redirectByRole(storedUser.roles, navigate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show ban/suspend message if redirected from interceptor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");
    if (reason === "banned")
      setError("Your account has been banned. Please contact support.");
    else if (reason === "suspended")
      setError("Your account has been suspended. Please contact support.");
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const user = res.data.user;
      if (!user || !user.roles) { setError("Invalid user data from server"); setLoading(false); return; }

      // Block banned/suspended users at login too
      if (user.status === "Banned") {
        setError("Your account has been banned. Please contact support.");
        setLoading(false);
        return;
      }
      if (user.status === "Suspended") {
        setError("Your account has been suspended. Please contact support.");
        setLoading(false);
        return;
      }

      const normalizedUser = {
        ...user,
        roles: Array.isArray(user.roles)
          ? user.roles.map(r => r.toLowerCase().trim())
          : [user.roles.toLowerCase().trim()],
      };
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", res.data.token);
      redirectByRole(normalizedUser.roles, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 shadow-md bg-white">
        <h1
          className="font-bold text-green-600 text-xl sm:text-2xl cursor-pointer hover:text-green-700 transition"
          onClick={() => navigate("/")}
        >
          HealthHaul Nepal
        </h1>
        <div className="flex gap-3 sm:gap-6 items-center font-medium text-gray-600">
          <Link to="/" className="hover:text-green-600 transition text-sm sm:text-base">Home</Link>
          <Link to="/signup" className="bg-green-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition shadow-sm text-sm sm:text-base">
            Signup
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex-grow flex justify-center items-center p-4 sm:p-6">
        <div className="flex bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl">

          {/* LEFT IMAGE */}
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-green-500 to-green-700">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              alt="Login"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Welcome Back!</h2>
              <p className="text-base lg:text-lg text-gray-200">Access your account and manage your health needs</p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Login to Your Account</h2>
              <p className="text-gray-600 text-sm sm:text-base">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    name="email" type="email" placeholder="you@example.com" onChange={change} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-xs sm:text-[12px] text-green-600 hover:text-green-700 font-semibold transition">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    name="password" type={showPass ? "text" : "password"} placeholder="••••••••" onChange={change} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 pr-10 sm:pr-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition">
                    {showPass ? (
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : "Login"}
              </button>
            </form>

            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Don't have an account?{" "}
                <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">Create one now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white text-center py-5 sm:py-6">
        <p className="text-gray-400 text-xs sm:text-sm">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
      </footer>
    </div>
  );
}