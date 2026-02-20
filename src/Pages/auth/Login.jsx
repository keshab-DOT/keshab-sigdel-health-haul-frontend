import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.roles) return;
    redirectByRole(storedUser.roles);
  }, []);

  // ✅ FIXED: handles array or string roles, and any role value from DB
  const redirectByRole = (roles) => {
    const role = Array.isArray(roles) ? roles[0] : roles;
    console.log("Role detected:", role); // remove this after confirming it works
    if (role === "pharmacy") {
      navigate("/pharmacy/dashboard");
    } else {
      // covers "user", "seller", or any other non-pharmacy role
      navigate("/user/dashboard");
    }
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const user = res.data.user;
      console.log("Server returned user:", user); // remove after confirming
      if (!user || !user.roles) {
        setError("Invalid user data from server");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(user));
      redirectByRole(user.roles);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
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
        <div className="flex gap-6 items-center font-medium text-gray-600">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/signup" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm">
            Signup
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div className="flex bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full">

          {/* LEFT IMAGE */}
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-green-500 to-green-700">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              alt="Login"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
              <p className="text-lg text-gray-200">Access your account and manage your health needs</p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Login to Your Account</h2>
              <p className="text-gray-600">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    onChange={change}
                    required
                    className="border border-gray-300 p-3 pl-12 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={change}
                    required
                    className="border border-gray-300 p-3 pl-12 pr-12 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
                  >
                    {showPass ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

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
                    <span>Logging in...</span>
                  </div>
                ) : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                  Create one now
                </Link>
              </p>
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