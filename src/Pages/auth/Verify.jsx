import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/verifyEmail", {
        email,
        verificationCode: code,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await api.post("/auth/resendOTP", { email });
      alert("OTP sent again to your email");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between px-8 py-4 shadow bg-white">
        <h1 className="font-bold text-green-600 text-xl">HealthHaul Nepal</h1>
        <Link to="/login" className="hover:text-green-600">Login</Link>
      </nav>

      {/* VERIFY SECTION */}
      <div className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <div className="flex bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl w-full">

          {/* LEFT IMAGE */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://imgs.search.brave.com/Xcj7s5njKXO6OCsnT93w01nJZhv-4qX39PcusX5x_fI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzUy/NjA2MS9wZXhlbHMt/cGhvdG8tNzUyNjA2/MS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA"
              alt="Verification"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
              <h2 className="text-3xl font-bold">Verify Your Email</h2>
              <p className="text-sm mt-2">
                Enter the OTP sent to your email address.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Email Verification
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              OTP sent to <span className="font-semibold">{email}</span>
            </p>

            <form onSubmit={verify} className="space-y-4">

              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="border p-3 w-full rounded text-center tracking-widest text-lg focus:outline-green-500"
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full text-white py-3 rounded font-bold transition-colors"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>

              <p className="text-sm text-center mt-3">
                Didn’t receive OTP?{" "}
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} HealthHaul Nepal
      </footer>
    </div>
  );
}
