import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";
import UserDashboard from "./Pages/Dashboard/User/UserDashboard";
import UserOrderPage from "./Pages/Dashboard/User/UserOrderPage";
import CartPage from "./Pages/Dashboard/User/CartPage";
import ProfilePage from "./Pages/Dashboard/User/ProfilePage";
import PharmacyDashboard from "./Pages/Dashboard/Pharmacy/PharmacyDashboard";
import ManageMedicines from "./Pages/Dashboard/Pharmacy/ManageMedicines";

function ProtectedRoute({ children, requiredRole }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) return <Navigate to="/login" replace />;
  const role = Array.isArray(storedUser.roles) ? storedUser.roles[0] : storedUser.roles;
  if (requiredRole === "pharmacy" && role !== "pharmacy") return <Navigate to="/login" replace />;
  if (requiredRole === "user" && role === "pharmacy") return <Navigate to="/pharmacy/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />

        {/* USER ROUTES */}
        <Route path="/user/dashboard" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/orders"    element={<ProtectedRoute requiredRole="user"><UserOrderPage /></ProtectedRoute>} />
        <Route path="/user/order"     element={<ProtectedRoute requiredRole="user"><UserOrderPage /></ProtectedRoute>} />
        <Route path="/user/cart"      element={<ProtectedRoute requiredRole="user"><CartPage /></ProtectedRoute>} />
        <Route path="/user/profile"   element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />
        <Route path="/user/support"   element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />

        {/* PHARMACY ROUTES */}
        <Route path="/pharmacy/dashboard" element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboard /></ProtectedRoute>} />
        <Route path="/pharmacy/medicines" element={<ProtectedRoute requiredRole="pharmacy"><ManageMedicines /></ProtectedRoute>} />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;