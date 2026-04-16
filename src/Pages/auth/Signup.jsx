import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleFields, setVisibleFields] = useState({ pass: false, confirm: false });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleVisibility = (field) =>
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      await api.post("auth/register", formData);
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

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
          <Link
            to="/login"
            className="bg-green-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition shadow-sm text-sm sm:text-base"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex-grow flex justify-center items-center p-4 sm:p-6">
        <div className="flex bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl">

          {/* LEFT IMAGE */}
          <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-green-500 to-green-700">
            <img
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              alt="Pharmacy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Join HealthHaul Nepal</h2>
              <p className="text-base lg:text-lg text-gray-200">Start your journey to convenient healthcare delivery</p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 overflow-y-auto">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Create Your Account</h2>
              <p className="text-gray-600 text-sm sm:text-base">Fill in your details to get started</p>
            </div>

            <form onSubmit={submit} className="space-y-4 sm:space-y-5">

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    name="name" placeholder="Your name" onChange={handleChange} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    name="email" type="email" placeholder="you@example.com" onChange={handleChange} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    name="password" type={visibleFields.pass ? "text" : "password"}
                    placeholder="••••••••" onChange={handleChange} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 pr-10 sm:pr-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => toggleVisibility("pass")}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition">
                    <EyeIcon visible={visibleFields.pass} />
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    name="confirmPassword" type={visibleFields.confirm ? "text" : "password"}
                    placeholder="••••••••" onChange={handleChange} required
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 pr-10 sm:pr-12 w-full rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => toggleVisibility("confirm")}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition">
                    <EyeIcon visible={visibleFields.confirm} />
                  </button>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <select
                    name="role" onChange={handleChange} value={formData.role}
                    className="border border-gray-300 p-2.5 sm:p-3 pl-10 sm:pl-12 w-full rounded-lg bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none cursor-pointer"
                  >
                    <option value="USER">Customer</option>
                    <option value="PHARMACY">Pharmacy</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm">{error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit" disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </div>
                ) : "Sign Up"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{" "}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </p>
            </form>

            <div className="mt-5 sm:mt-6 text-center pb-2">
              <p className="text-gray-600 text-sm sm:text-base">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">Login here</Link>
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