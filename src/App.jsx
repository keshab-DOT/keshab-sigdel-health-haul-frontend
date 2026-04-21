import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";
import { Pagination, usePagination } from "./Pages/Dashboard/Pagination";


// Customer User
import UserDashboard from "./Pages/Dashboard/User/UserDashboard";
import SearchMedicines from "./Pages/Dashboard/User/SearchMedicines";
import CartPage from "./Pages/Dashboard/User/CartPage";
import UserOrderPage from "./Pages/Dashboard/User/UserOrderPage";
import ProfilePage from "./Pages/Dashboard/User/ProfilePage";
import UserChatPage from "./Pages/Dashboard/User/Userchatpage";
import KhaltiResultPage from "./Pages/payment/KhaltiResultPage";
import OrderMapCard from "./Pages/Dashboard/User/OrderMapCard";


// Pharmacy
import PharmacyDashboard from "./Pages/Dashboard/Pharmacy/PharmacyDashboard";
import PharmacyOrders from "./Pages/Dashboard/Pharmacy/Pharmacyorders";
import PharmacyProducts from "./Pages/Dashboard/Pharmacy/Pharmacyproducts";
import PharmacyProfile from "./Pages/Dashboard/Pharmacy/Pharmacyprofile";
import PharmacyChatPage from "./Pages/Dashboard/Pharmacy/Pharmacychatpage";
import PharmacyReviews from "./Pages/Dashboard/Pharmacy/Pharmacyreviews";
import PharmacyPayments from "./Pages/Dashboard/Pharmacy/PharmacyPayments";


// Admin
import AdminDashboard from "./Pages/Dashboard/Admin/Admindashboard";
import AdminUsers from "./Pages/Dashboard/Admin/Adminusers";
import AdminProducts from "./Pages/Dashboard/Admin/Adminproducts";
import AdminChatPage from "./Pages/Dashboard/Admin/Adminchatpage";
import AdminReviews from "./Pages/Dashboard/Admin/Adminreviews";


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
          <Route path="/pagination" element={<Pagination />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/search" element={<SearchMedicines />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/orders" element={<UserOrderPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/chat" element={<UserChatPage />} />
          <Route path="/payment/result" element={<KhaltiResultPage />} />
          <Route path="/user/order/:orderId/map" element={<OrderMapCard />} />  

          {/* Pharmacy Routes */}
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
          <Route path="/pharmacy/orders" element={<PharmacyOrders />} />
          <Route path="/pharmacy/products" element={<PharmacyProducts />} />
          <Route path="/pharmacy/profile" element={<PharmacyProfile />} />
          <Route path="/pharmacy/chat" element={<PharmacyChatPage />} />
          <Route path="/pharmacy/reviews" element={<PharmacyReviews />} />
          <Route path="/pharmacy/payments" element={<PharmacyPayments />} />


          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/chat" element={<AdminChatPage />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;