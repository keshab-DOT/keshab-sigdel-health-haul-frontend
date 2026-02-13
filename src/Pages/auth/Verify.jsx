import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Verify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await api.post("/auth/verify", { otp });
      navigate("/login"); // after verification, go to login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
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

      {/* Main */}
      <div className="flex justify-center items-center flex-1 p-6 mt-8">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Account</h2>
          <p className="text-gray-500 mb-6 text-sm text-center">Enter the OTP sent to your email</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            />

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Didn't receive OTP? <button className="font-semibold text-green-500">Resend</button>
          </p>
        </div>
      </div>

      <footer className="text-center text-gray-400 text-xs py-6">
        © 2024 Health Haul Nepal
      </footer>
    </div>
  );
};

export default Verify;
