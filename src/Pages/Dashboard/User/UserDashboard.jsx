// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(storedUser);
//   }, [navigate]);

//   const logout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* NAVBAR */}
//       <nav className="flex justify-between px-8 py-4 shadow bg-white">
//         <h1 className="font-bold text-green-600 text-xl">HealthHaul Nepal</h1>
//         <div className="flex gap-4">
//           <button onClick={logout} className="text-red-500 font-semibold">
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* DASHBOARD CONTENT */}
//       <div className="flex-grow p-8 bg-green-50">
//         <h2 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h2>
//         <p className="text-gray-700 mb-6">This is your user dashboard.</p>

//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="p-6 bg-white shadow rounded">
//             <h3 className="font-semibold text-lg mb-2">Order Medicines</h3>
//             <p className="text-gray-600">Browse and order medicines from trusted pharmacies.</p>
//           </div>

//           <div className="p-6 bg-white shadow rounded">
//             <h3 className="font-semibold text-lg mb-2">Track Orders</h3>
//             <p className="text-gray-600">Track your order status in real time.</p>
//           </div>

//           <div className="p-6 bg-white shadow rounded">
//             <h3 className="font-semibold text-lg mb-2">Profile Settings</h3>
//             <p className="text-gray-600">Update your account details and password.</p>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="bg-gray-900 text-white text-center py-4">
//         © HealthHaul Nepal
//       </footer>
//     </div>
//   );
// }
