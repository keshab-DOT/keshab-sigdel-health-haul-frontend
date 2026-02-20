import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";

// Customer
import UserDashboard  from "./Pages/Dashboard/User/UserDashboard";
import SearchMedicines from "./Pages/Dashboard/User/SearchMedicines";
import CartPage       from "./Pages/Dashboard/User/CartPage";
import UserOrderPage  from "./Pages/Dashboard/User/UserOrderPage";
import ProfilePage    from "./Pages/Dashboard/User/ProfilePage";

// Pharmacy (keep your existing imports here)
import PharmacyDashboard from "./Pages/Dashboard/Pharmacy/PharmacyDashboard";
import ManageMedicines   from "./Pages/Dashboard/Pharmacy/ManageMedicines";

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, requiredRole }) {
  const stored = JSON.parse(localStorage.getItem("user"));
  if (!stored) return <Navigate to="/login" replace />;

  // Normalise role — backend may store as "user" or "USER" etc.
  const role = (Array.isArray(stored.roles) ? stored.roles[0] : stored.roles)?.toLowerCase();

  if (requiredRole === "pharmacy" && role !== "pharmacy")
    return <Navigate to="/login" replace />;
  if (requiredRole === "user" && role === "pharmacy")
    return <Navigate to="/pharmacy/dashboard" replace />;

  return children;
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />

        {/* Customer routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/search"    element={<ProtectedRoute requiredRole="user"><SearchMedicines /></ProtectedRoute>} />
        <Route path="/user/cart"      element={<ProtectedRoute requiredRole="user"><CartPage /></ProtectedRoute>} />
        <Route path="/user/orders"    element={<ProtectedRoute requiredRole="user"><UserOrderPage /></ProtectedRoute>} />
        <Route path="/user/order"     element={<ProtectedRoute requiredRole="user"><UserOrderPage /></ProtectedRoute>} />
        <Route path="/user/profile"   element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />
        {/* /user/support now renders ProfilePage and auto-opens the support tab */}
        <Route path="/user/support"   element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />

        {/* Pharmacy routes */}
        <Route path="/pharmacy/dashboard" element={<ProtectedRoute requiredRole="pharmacy"><PharmacyDashboard /></ProtectedRoute>} />
        <Route path="/pharmacy/medicines" element={<ProtectedRoute requiredRole="pharmacy"><ManageMedicines /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;