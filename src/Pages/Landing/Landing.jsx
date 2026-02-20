import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition">
          HealthHaul Nepal
        </h1>
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition">
            Home
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium transition">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-medium"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 bg-gradient-to-br from-green-50 to-green-100 flex-grow">

        {/* LEFT TEXT */}
        <div className="max-w-xl animate-fade-in">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🚀 Your Health, Our Priority
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Fast & Reliable <span className="text-green-600">Medicine Delivery</span> in Nepal
          </h2>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            HealthHaul Nepal connects pharmacies and customers to deliver
            medicines quickly and safely at your doorstep.
          </p>

          <div className="flex gap-4 mb-8">
            <Link 
              to="/signup"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
            >
              Get Started →
            </Link>

            <Link 
              to="/login"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition font-semibold"
            >
              Login
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex gap-8 items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Licensed Pharmacies</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Quick Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Payment</span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-10 md:mt-0 grid grid-cols-2 gap-4 animate-slide-in">
          <img
            src="https://imgs.search.brave.com/YxgtwdxNy2yYuqRTstyv_NEb8hoUodQV581UF48qds0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/NTQ1LzA5MC9zbWFs/bC9waGFybWFjZXV0/aWNhbC1tZWRpY2lu/ZS1waWxscy1hbmQt/Y2Fwc3VsZXMtb24t/d29vZGVuLXRhYmxl/LWluLWRhcmstcm9v/bS1haS1nZW5lcmF0/ZWQtcHJvLXBob3Rv/LmpwZw"
            alt="Medicine Delivery"
            className="rounded-xl shadow-2xl w-full hover:shadow-3xl transition transform hover:scale-105 duration-300"
          />
          <img
            src="https://imgs.search.brave.com/UzNuQj588Eoiu4HuRoYVe4ZJxLA_dSzBrcLY0zc4NUA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/OTUzMTY5Mi9waG90/by9zZW5pb3Itd29t/YW4tdGFraW5nLW1l/ZGljaW5lLWF0LWhv/bWUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXJYeXNzRURr/emNyRWJ1MjNtdDdX/Q0tjUkxFaC1zYWY5/dlFpR01DTzNzdTg9"
            alt="Medicines"
            className="rounded-xl shadow-2xl w-full hover:shadow-3xl transition transform hover:scale-105 duration-300 mt-8"
          />
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-8 md:px-20 py-12 bg-green-600 text-white">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold mb-2">500+</h3>
            <p className="text-green-100">Trusted Pharmacies</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">10K+</h3>
            <p className="text-green-100">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">30min</h3>
            <p className="text-green-100">Average Delivery</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p className="text-green-100">Customer Support</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 md:px-20 py-20 bg-white">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-gray-900">Why Choose HealthHaul?</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to making healthcare accessible and convenient for everyone in Nepal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="group p-8 shadow-lg rounded-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500 bg-white">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-500 transition">
              <svg className="w-8 h-8 text-green-600 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h4 className="font-bold text-2xl mb-3 text-gray-900 group-hover:text-green-600 transition">
              Trusted Pharmacies
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Connect with verified and licensed pharmacies across Nepal. Every pharmacy is carefully vetted for quality and reliability.
            </p>
          </div>

          <div className="group p-8 shadow-lg rounded-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500 bg-white">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-500 transition">
              <svg className="w-8 h-8 text-green-600 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <h4 className="font-bold text-2xl mb-3 text-gray-900 group-hover:text-green-600 transition">
              Fast Delivery
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Medicines delivered quickly to your location. Track your order in real-time and get updates at every step.
            </p>
          </div>

          <div className="group p-8 shadow-lg rounded-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500 bg-white">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-500 transition">
              <svg className="w-8 h-8 text-green-600 group-hover:text-white transition" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h4 className="font-bold text-2xl mb-3 text-gray-900 group-hover:text-green-600 transition">
              Easy Ordering
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Order medicines in just a few clicks. Simple interface, secure payment, and hassle-free experience guaranteed.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-8 md:px-20 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h3>
          <p className="text-gray-600 text-lg">Get your medicines in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
              1
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Search & Order</h4>
            <p className="text-gray-600">Browse medicines and add them to your cart</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
              2
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Confirm & Pay</h4>
            <p className="text-gray-600">Review your order and make secure payment</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
              3
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Receive</h4>
            <p className="text-gray-600">Get your medicines delivered at your doorstep</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-8 md:px-20 py-20 bg-green-600 text-white text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust HealthHaul Nepal for their medicine needs
        </p>
        <Link 
          to="/signup"
          className="inline-block bg-white text-green-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition shadow-xl font-bold text-lg"
        >
          Create Your Account Now →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-xl mb-4 text-green-400">HealthHaul Nepal</h4>
              <p className="text-gray-400 text-sm">
                Your trusted partner for fast and reliable medicine delivery across Nepal.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition">Signup</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
      `}</style>

    </div>
  );
}