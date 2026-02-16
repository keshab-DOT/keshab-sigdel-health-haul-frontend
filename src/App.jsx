import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";
import UserDashboard from "./Pages/Dashboard/User/UserDashboard";
import PharmacyDashboard from "./Pages/Dashboard/Pharmacy/PharmacyDashboard";
import ManageMedicines from "./Pages/Dashboard/Pharmacy/ManageMedicines";

// Placeholder pages for user dashboard cards
const OrderPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 Order Medicines</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const TrackOrdersPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📦 Track Orders</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const UserProfilePage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">⚙️ User Profile</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const PrescriptionPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📋 Upload Prescription</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const SupportPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">💬 Customer Support</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

// Placeholder pages for pharmacy dashboard cards
const PharmacyOrdersPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📋 Pharmacy Orders</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const InventoryReportPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Inventory Report</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

const PharmacyProfilePage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">⚙️ Pharmacy Profile</h1>
      <p className="text-gray-600">This page is under development</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />

        {/* USER DASHBOARD ROUTES */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/order" element={<OrderPage />} />
        <Route path="/user/track" element={<TrackOrdersPage />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/user/prescription" element={<PrescriptionPage />} />
        <Route path="/user/support" element={<SupportPage />} />

        {/* PHARMACY DASHBOARD ROUTES */}
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/pharmacy/medicines" element={<ManageMedicines />} />
        <Route path="/pharmacy/orders" element={<PharmacyOrdersPage />} />
        <Route path="/pharmacy/inventory" element={<InventoryReportPage />} />
        <Route path="/pharmacy/profile" element={<PharmacyProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;