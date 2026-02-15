import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./Pages/auth/Signup";
import Verify from "./Pages/auth/Verify";
import Login from "./Pages/auth/Login";
import Landing from "./Pages/Landing/Landing";
import UserDashboard from "./Pages/Dashboard/User/UserDashboard";

// Placeholder pages for dashboard cards
const OrderPage = () => <div className="p-8">🛒 Order Medicines Page</div>;
const TrackOrdersPage = () => <div className="p-8">📦 Track Orders Page</div>;
const ProfilePage = () => <div className="p-8">⚙️ Profile Page</div>;

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
        <Route path="/user/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
