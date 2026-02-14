import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.role === "pharmacy") {
      navigate("/pharmacy/dashboard");
    } else if (storedUser?.role === "user") {
      navigate("/user/dashboard");
    }
  }, [navigate]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data); // debug

      // ✅ Handle both possible response structures
      const user = res.data.user ? res.data.user : res.data;

      if (!user) {
        setError("User data missing from server");
        return;
      }

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect by role
      if (user.role === "pharmacy") {
        navigate("/pharmacy/dashboard");
      } else if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between px-8 py-4 shadow bg-white">
        <h1 className="font-bold text-green-600">HealthHaul Nepal</h1>
        <div className="flex gap-5">
          <Link to="/">Home</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      {/* LOGIN FORM */}
      <div className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl w-full">

          {/* LEFT IMAGE */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88"
              className="absolute inset-0 w-full h-full object-cover"
              alt="Login"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-6">Login</h2>

            <form onSubmit={submit} className="space-y-4">

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={change}
                required
                className="border p-3 w-full rounded"
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={change}
                  required
                  className="border p-3 w-full rounded pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-medium"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button className="bg-green-500 w-full text-white py-3 rounded">
                Login
              </button>

            </form>

            <p className="mt-6 text-sm">
              No account?{" "}
              <Link to="/signup" className="underline">
                Signup
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-4">
        © HealthHaul Nepal
      </footer>
    </div>
  );
}
