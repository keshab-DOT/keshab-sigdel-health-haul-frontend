import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "user"
  });

  const [error, setError] = useState("");
  
  // Track visibility for each field separately
  const [visibleFields, setVisibleFields] = useState({
    pass: false,
    confirm: false
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Toggle function for a specific field
  const toggleVisibility = (field) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/register", formData);
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between px-8 py-4 shadow bg-white items-center">
        <h1 className="font-bold text-green-600 text-xl">HealthHaul Nepal</h1>
        <div className="flex gap-5 font-medium text-gray-600">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <Link to="/Login" className="hover:text-green-600">Login</Link>
        </div>
      </nav>

      <div className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl w-full">
          
          <div className="hidden md:block w-1/2 relative">
            <img 
              src="https://imgs.search.brave.com/Q4Q92jJcbHPRHX8NHFkZi4Wb1HiewM_gKDxR3niImgk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTIw/Njc3NDYwOC9waG90/by90YWJsZXQtcGls/bHMtbWVkaWNpbmUt/Y2Fwc3VsZXMtcGxh/Y2Utb24tbWlycm9y/LXRhYmxlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz11bmVO/V2R3amp0VDFndzNK/UXR1WVRhQ3hfbDhX/N1ZJVGhUUXl1YnNR/SDl3PQ"
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Pharmacy"
            />
          </div>

          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>

            <form onSubmit={submit} className="space-y-4">
              <input name="name" placeholder="Full Name" onChange={handleChange} required
                className="border p-3 w-full rounded focus:outline-green-500" />

              <input name="email" type="email" placeholder="Email" onChange={handleChange} required 
                className="border p-3 w-full rounded focus:outline-green-500" />

              {/* Password Field */}
              <div className="relative">
                <input
                  name="password"
                  type={visibleFields.pass ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="border p-3 w-full rounded pr-14 focus:outline-green-500"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('pass')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold uppercase hover:text-green-600"
                >
                  {visibleFields.pass ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={visibleFields.confirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                  className="border p-3 w-full rounded pr-14 focus:outline-green-500"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold uppercase hover:text-green-600"
                >
                  {visibleFields.confirm ? "Hide" : "Show"}
                </button>
              </div>

              <select name="role" onChange={handleChange} className="border p-3 w-full rounded bg-white">
                <option value="user">Customer</option>
                <option value="pharmacy">Pharmacy</option>
              </select>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button className="bg-green-600 hover:bg-green-700 w-full text-white py-3 rounded font-bold transition-colors mt-2">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} HealthHaul Nepal
      </footer>
    </div>
  );
}