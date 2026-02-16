import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

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
    fetchUserStats();
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get("/user/stats");
      setStats(response.data);
    } catch (err) {
      console.log("Failed to fetch stats:", err);
      // Keep default stats if API fails
    }
  };

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
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
        <h1
          className="font-bold text-green-600 text-2xl cursor-pointer hover:text-green-700 transition"
          onClick={() => navigate("/")}
        >
          HealthHaul Nepal
        </h1>

        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-medium text-lg">
            👋 {user.name}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}
      <div className="flex-grow p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Manage your medicines, track orders, and update your profile all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Total Orders */}
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Orders</p>
                <h3 className="text-4xl font-bold">{stats.totalOrders}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-1">Pending Orders</p>
                <h3 className="text-4xl font-bold">{stats.pendingOrders}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Completed Orders</p>
                <h3 className="text-4xl font-bold">{stats.completedOrders}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Medicines */}
            <div
              onClick={() => navigate("/user/order")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">🛒</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition">
                Order Medicines
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse and order medicines from trusted pharmacies near you. Fast delivery guaranteed.
              </p>
              <div className="mt-4 text-green-600 font-medium flex items-center group-hover:translate-x-2 transition">
                Start ordering
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Track Orders */}
            <div
              onClick={() => navigate("/user/track")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">📦</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition">
                Track Orders
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View your complete order history and track your deliveries in real-time with live updates.
              </p>
              <div className="mt-4 text-blue-600 font-medium flex items-center group-hover:translate-x-2 transition">
                Track now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Profile Settings */}
            <div
              onClick={() => navigate("/user/profile")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">⚙️</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-600 transition">
                Profile Settings
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Update your personal information, delivery addresses, and change your password securely.
              </p>
              <div className="mt-4 text-purple-600 font-medium flex items-center group-hover:translate-x-2 transition">
                Manage profile
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">More Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Prescription Upload */}
            <div
              onClick={() => navigate("/user/prescription")}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition border-l-4 border-green-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 mb-1">Upload Prescription</h4>
                  <p className="text-gray-600 text-sm">Upload your prescription and get medicines delivered</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Support */}
            <div
              onClick={() => navigate("/user/support")}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition border-l-4 border-yellow-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 mb-1">Customer Support</h4>
                  <p className="text-gray-600 text-sm">Get help with your orders and queries</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition">
                Terms
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                Privacy
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white text-sm transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}