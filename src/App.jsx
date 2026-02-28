import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";

// Customer
import UserDashboard from "./Pages/Dashboard/User/UserDashboard";
import SearchMedicines from "./Pages/Dashboard/User/SearchMedicines";
import CartPage from "./Pages/Dashboard/User/CartPage";
import UserOrderPage from "./Pages/Dashboard/User/UserOrderPage";
import ProfilePage from "./Pages/Dashboard/User/ProfilePage";
import SettingsPage from "./Pages/Dashboard/User/SettingsPage";

// Pharmacy
import PharmacyDashboard from "./Pages/Dashboard/Pharmacy/PharmacyDashboard";
import PharmacyOrders from "./Pages/Dashboard/Pharmacy/Pharmacyorders";
import PharmacyProducts from "./Pages/Dashboard/Pharmacy/Pharmacyproducts";
import PharmacyProfile from "./Pages/Dashboard/Pharmacy/PharmacyProfile";

// Admin
import AdminDashboard from "./Pages/Dashboard/Admin/AdminDashboard";
import AdminUsers from "./Pages/Dashboard/Admin/Adminusers";
import AdminProducts from "./Pages/Dashboard/Admin/Adminproducts";

function App() {
  return (
    <>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/search" element={<SearchMedicines />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/orders" element={<UserOrderPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/settings" element={<SettingsPage />} />
          <Route path="/user/support" element={<SettingsPage />} />

          {/* Pharmacy Routes */}
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
          <Route path="/pharmacy/orders" element={<PharmacyOrders />} />
          <Route path="/pharmacy/products" element={<PharmacyProducts />} />
          <Route path="/pharmacy/profile" element={<PharmacyProfile />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;