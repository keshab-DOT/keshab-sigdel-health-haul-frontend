import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-lg sm:text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition">
          HealthHaul Nepal
        </h1>
        <div className="flex gap-3 sm:gap-8 items-center">
          <Link
            to="/"
            className="hidden sm:block text-gray-700 hover:text-green-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-green-600 font-medium transition text-sm sm:text-base"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-medium text-sm sm:text-base"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-12 sm:py-20 bg-gradient-to-br from-green-50 to-green-100 flex-grow gap-10">
        <div className="max-w-xl animate-fade-in w-full">
          <div className="inline-block bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            🚀 Your Health, Our Priority
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
            Fast & Reliable{" "}
            <span className="text-green-600">Medicine Delivery</span> in Nepal
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            HealthHaul Nepal connects pharmacies and customers to deliver
            medicines quickly and safely at your doorstep.
          </p>
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
            <Link
              to="/signup"
              className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-sm sm:text-base"
            >
              Get Started →
            </Link>
            <Link
              to="/login"
              className="border-2 border-green-600 text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-50 transition font-semibold text-sm sm:text-base"
            >
              Login
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-8 items-center text-xs sm:text-sm text-gray-600">
            {["Licensed Pharmacies", "Quick Delivery", "Secure Payment"].map(
              (label) => (
                <div key={label} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{label}</span>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-in w-full md:w-auto md:max-w-sm lg:max-w-md">
          <img
            src="https://imgs.search.brave.com/YxgtwdxNy2yYuqRTstyv_NEb8hoUodQV581UF48qds0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/NTQ1LzA5MC9zbWFs/bC9waGFybWFjZXV0/aWNhbC1tZWRpY2lu/ZS1waWxscy1hbmQt/Y2Fwc3VsZXMtb24t/d29vZGVuLXRhYmxl/LWluLWRhcmstcm9v/bS1haS1nZW5lcmF0/ZWQtcHJvLXBob3Rv/LmpwZw"
            alt="Medicine Delivery"
            className="rounded-xl shadow-2xl w-full hover:shadow-3xl transition transform hover:scale-105 duration-300"
          />
          <img
            src="https://imgs.search.brave.com/UzNuQj588Eoiu4HuRoYVe4ZJxLA_dSzBrcLY0zc4NUA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/OTUzMTY5Mi9waG90/by9zZW5pb3Itd29t/YW4tdGFraW5nLW1l/ZGljaW5lLWF0LWhv/bWUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXJYeXNzRURr/emNyRWJ1MjNtdDdX/Q0tjUkxFaC1zYWY5/dlFpR01DTzNzdTg9"
            alt="Medicines"
            className="rounded-xl shadow-2xl w-full hover:shadow-3xl transition transform hover:scale-105 duration-300 mt-6 sm:mt-8"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 sm:px-8 md:px-20 py-10 sm:py-12 bg-green-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            ["100+", "Trusted Pharmacies"],
            ["10K+", "Happy Customers"],
            ["30min", "Avg Delivery"],
            ["24/7", "Support"],
          ].map(([num, label]) => (
            <div key={label}>
              <h3 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                {num}
              </h3>
              <p className="text-green-100 text-sm sm:text-base">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-8 md:px-20 py-14 sm:py-20 bg-white">
        <div className="text-center mb-10 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            Why Choose HealthHaul?
          </h3>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            We're committed to making healthcare accessible and convenient for
            everyone in Nepal
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Trusted Pharmacies",
              desc: "Connect with verified and licensed pharmacies across Nepal. Every pharmacy is carefully vetted for quality and reliability.",
              icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
            },
            {
              title: "Fast Delivery",
              desc: "Medicines delivered quickly to your location. Track your order in real-time and get updates at every step.",
              icon: "M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z",
            },
            {
              title: "Easy Ordering",
              desc: "Order medicines in just a few clicks. Simple interface, secure payment, and hassle-free experience guaranteed.",
              icon: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z",
            },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              className="group p-6 sm:p-8 shadow-lg rounded-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500 bg-white"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6 group-hover:bg-green-500 transition">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-white transition"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d={icon} />
                </svg>
              </div>
              <h4 className="font-bold text-xl sm:text-2xl mb-2 sm:mb-3 text-gray-900 group-hover:text-green-600 transition">
                {title}
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 sm:px-8 md:px-20 py-14 sm:py-20 bg-gray-50">
        <div className="text-center mb-10 sm:mb-16">
          <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            How It Works
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Get your medicines in 3 simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
          {[
            ["Search & Order", "Browse medicines and add them to your cart"],
            ["Confirm & Pay", "Review your order and make secure payment"],
            ["Receive", "Get your medicines delivered at your doorstep"],
          ].map(([title, desc], i) => (
            <div key={title} className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-lg">
                {i + 1}
              </div>
              <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">
                {title}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 md:px-20 py-14 sm:py-20 bg-green-600 text-white text-center">
        <h3 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
          Ready to Get Started?
        </h3>
        <p className="text-base sm:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust HealthHaul Nepal for
          their medicine needs
        </p>
        <Link
          to="/signup"
          className="inline-block bg-white text-green-600 px-8 sm:px-10 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition shadow-xl font-bold text-base sm:text-lg"
        >
          Create Your Account Now →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-green-400">
                HealthHaul Nepal
              </h4>
              <p className="text-gray-400 text-sm">
                Your trusted partner for fast and reliable medicine delivery
                across Nepal.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3 sm:mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition text-sm"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-white transition text-sm"
                  >
                    Signup
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3 sm:mb-4">Contact Us</h5>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a
                    href="mailto:sigdelbibek9898@gmail.com"
                    className="hover:text-white transition break-all"
                  >
                    sigdelbibek9898@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a
                    href="tel:9829396927"
                    className="hover:text-white transition"
                  >
                    9829396927
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Itahari-8, Sunsari, Nepal</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-5 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
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
