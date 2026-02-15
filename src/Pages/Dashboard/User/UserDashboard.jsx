import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const role = storedUser.roles?.[0];
    if (role !== "user") {
      navigate("/login");
      return;
    }

    setUser(storedUser);
  }, [navigate]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }

    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <h1 className="font-bold text-green-600 text-xl cursor-pointer"
            onClick={() => navigate("/")}>
          HealthHaul Nepal
        </h1>

        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-medium">
            👋 {user.name}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ================= DASHBOARD CONTENT ================= */}
      <div className="flex-grow p-8">

        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {user.name}
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your medicines, track orders, and update your profile.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Order Medicines */}
          <div
            onClick={() => navigate("/user/order")}
            className="p-6 bg-white rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <h3 className="font-semibold text-lg mb-2 text-green-600">
              🛒 Order Medicines
            </h3>
            <p className="text-gray-600">
              Browse and order medicines from trusted pharmacies near you.
            </p>
          </div>

          {/* Track Orders */}
          <div
            onClick={() => navigate("/user/track")}
            className="p-6 bg-white rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <h3 className="font-semibold text-lg mb-2 text-blue-600">
              📦 Track Orders
            </h3>
            <p className="text-gray-600">
              View order history and track your deliveries in real time.
            </p>
          </div>

          {/* Profile Settings */}
          <div
            onClick={() => navigate("/user/profile")}
            className="p-6 bg-white rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1"
          >
            <h3 className="font-semibold text-lg mb-2 text-purple-600">
              ⚙️ Profile Settings
            </h3>
            <p className="text-gray-600">
              Update your personal information and change password.
            </p>
          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white text-center py-4">
        © {new Date().getFullYear()} HealthHaul Nepal
      </footer>

    </div>
  );
}
