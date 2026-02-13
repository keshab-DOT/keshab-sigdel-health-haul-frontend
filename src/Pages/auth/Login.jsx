import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="font-bold text-lg">Health Haul Nepal</h1>
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-green-500 transition">Home</Link>
          <Link to="/signup" className="hover:text-green-500 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Main */}
      <div className="flex justify-center items-center flex-1 p-6 mt-8">
        <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl w-full">

          {/* Left Image */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
              alt="Healthcare"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
              <h2 className="text-3xl font-bold mb-3">Healthcare at Your Doorstep</h2>
              <p className="text-sm">Trusted medicine delivery across Nepal.</p>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-sm">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-lg mt-1 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-4 text-sm"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center">
              New user? <Link to="/signup" className="font-semibold underline">Create account</Link>
            </p>
          </div>

        </div>
      </div>

      <footer className="text-center text-gray-400 text-xs py-6">
        © 2024 Health Haul Nepal
      </footer>
    </div>
  );
};

export default Login;
