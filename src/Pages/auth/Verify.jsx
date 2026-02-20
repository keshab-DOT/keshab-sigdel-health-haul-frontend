import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verifyEmail", { email, verificationCode: code });
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    setError("");
    try {
      // Backend endpoint is resendOtp (matches userRoutes: /resendOtp)
      await api.post("/auth/resendOtp", { email });
      setSuccess("OTP resent successfully! Check your email.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 shadow-md bg-white">
        <h1
          className="font-bold text-green-600 text-2xl cursor-pointer hover:text-green-700 transition"
          onClick={() => navigate("/")}
        >
          HealthHaul Nepal
        </h1>
        <Link to="/login" className="hover:text-green-600 font-medium transition">Login</Link>
      </nav>

      {/* MAIN */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div className="flex bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full">

          {/* LEFT IMAGE */}
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-green-500 to-green-700">
            <img
              src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80"
              alt="Verification"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 text-white z-10">
              <h2 className="text-4xl font-bold mb-3">Verify Your Email</h2>
              <p className="text-lg text-gray-200">Enter the OTP sent to your email to activate your account</p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-12">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Email Verification</h2>
              <p className="text-gray-600">
                We sent a 4-digit OTP to{" "}
                <span className="font-semibold text-green-600">{email || "your email"}</span>
              </p>
            </div>

            <form onSubmit={verify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={4}
                  required
                  className="border border-gray-300 p-4 w-full rounded-lg text-center tracking-[0.5em] text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : "Verify Account"}
              </button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the OTP?{" "}
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resending}
                    className="text-green-600 font-semibold hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link to="/signup" className="text-gray-500 hover:text-green-600 text-sm transition">
                ← Back to Signup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
      </footer>
    </div>
  );
}