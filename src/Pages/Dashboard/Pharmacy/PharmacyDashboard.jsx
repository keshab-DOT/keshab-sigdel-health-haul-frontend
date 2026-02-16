import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalMedicines: 0,
    lowStockItems: 0,
    revenue: 0,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const role = storedUser.roles?.[0];
    if (role !== "pharmacy") {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchPharmacyStats();
  }, [navigate]);

  const fetchPharmacyStats = async () => {
    try {
      const response = await api.get("/pharmacy/stats");
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
          HealthHaul Nepal - Pharmacy
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
            Manage your pharmacy inventory, orders, and customer requests all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {/* Total Orders */}
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
                <h3 className="text-4xl font-bold">{stats.totalOrders}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg text-white">
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
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Completed Orders</p>
                <h3 className="text-4xl font-bold">{stats.completedOrders}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Medicines */}
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Medicines</p>
                <h3 className="text-4xl font-bold">{stats.totalMedicines}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.122l1.027 1.027a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Low Stock Items</p>
                <h3 className="text-4xl font-bold">{stats.lowStockItems}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium mb-1">Total Revenue</p>
                <h3 className="text-4xl font-bold">NPR {stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Manage Medicines */}
            <div
              onClick={() => navigate("/pharmacy/medicines")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">💊</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition">
                Manage Medicines
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Add, edit, or remove medicines from your inventory.
              </p>
              <div className="mt-4 text-green-600 font-medium flex items-center group-hover:translate-x-2 transition">
                Manage now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* View Orders */}
            <div
              onClick={() => navigate("/pharmacy/orders")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">📋</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition">
                View Orders
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Process and manage customer orders efficiently.
              </p>
              <div className="mt-4 text-blue-600 font-medium flex items-center group-hover:translate-x-2 transition">
                View orders
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Inventory Report */}
            <div
              onClick={() => navigate("/pharmacy/inventory")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">📊</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-600 transition">
                Inventory Report
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View detailed stock levels and analytics.
              </p>
              <div className="mt-4 text-purple-600 font-medium flex items-center group-hover:translate-x-2 transition">
                View report
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Profile Settings */}
            <div
              onClick={() => navigate("/pharmacy/profile")}
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-500 transition">
                <span className="text-4xl group-hover:scale-110 transition">⚙️</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-600 transition">
                Profile Settings
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Update pharmacy details and settings.
              </p>
              <div className="mt-4 text-indigo-600 font-medium flex items-center group-hover:translate-x-2 transition">
                Manage profile
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {stats.lowStockItems > 0 && (
          <div className="mt-10">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
                  <p className="text-red-700 mt-1">
                    You have {stats.lowStockItems} item{stats.lowStockItems > 1 ? 's' : ''} running low on stock. Please restock soon.
                  </p>
                  <button
                    onClick={() => navigate("/pharmacy/medicines")}
                    className="mt-3 text-red-700 font-semibold hover:text-red-900 underline"
                  >
                    View Low Stock Items →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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