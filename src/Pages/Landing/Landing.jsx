import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="font-bold text-lg">Health Haul Nepal</h1>
        <div className="flex gap-6 text-sm">
          <Link to="/login" className="hover:text-green-500 transition">Login</Link>
          <Link to="/signup" className="hover:text-green-500 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col md:flex-row justify-center items-center p-6 mt-8">
        {/* Left Image */}
        <div className="md:w-1/2 relative min-h-[400px] w-full">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
            alt="Healthcare"
            className="absolute inset-0 w-full h-full object-cover rounded-l-xl"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
            <h2 className="text-3xl font-bold mb-3">Healthcare at Your Doorstep</h2>
            <p className="text-sm">Trusted medicine delivery across Nepal.</p>
          </div>
        </div>

        {/* Right Info */}
        <div className="md:w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome to Health Haul Nepal</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Get your medicines delivered safely to your doorstep. Join thousands of satisfied users in Nepal.
          </p>
          <Link
            to="/signup"
            className="w-full md:w-auto text-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs py-6 mt-auto">
        © 2024 Health Haul Nepal
      </footer>
    </div>
  );
};

export default Landing;
