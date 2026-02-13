import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // default role
  });
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
      await api.post("/auth/signup", formData);
      navigate("/verify"); // navigate to verification page
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          <Link to="/login" className="hover:text-green-500 transition">Login</Link>
        </div>
      </nav>

      {/* Main container */}
      <div className="flex flex-1 justify-center items-center p-6 mt-8">
        <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl w-full">

          {/* Left Image Panel */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
              alt="Healthcare"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
              <h2 className="text-3xl font-bold mb-3">Join Health Haul Nepal</h2>
              <p className="text-sm">Get your medicines delivered safely to your doorstep.</p>
            </div>
          </div>

          {/* Right Signup Form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8 text-sm">Enter your details to register.</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="text-sm font-semibold">Account Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                >
                  <option value="customer">Customer</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                />
              </div>

              {/* Password */}
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

              {/* Error */}
              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center">
              Already have an account? <Link to="/login" className="font-semibold underline">Login</Link>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs py-6">
        © 2024 Health Haul Nepal
      </footer>
    </div>
  );
};

export default Signup;