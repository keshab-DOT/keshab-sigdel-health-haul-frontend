import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between px-8 py-4 shadow bg-white">
        <h1 className="text-2xl font-bold text-green-600">HealthHaul Nepal</h1>
        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-green-50 flex-grow">

        {/* LEFT TEXT */}
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Fast & Reliable Medicine Delivery in Nepal
          </h2>

          <p className="text-gray-600 mb-8">
            HealthHaul Nepal connects pharmacies and customers to deliver
            medicines quickly and safely at your doorstep.
          </p>

          <div className="flex gap-4">
            <Link to="/signup"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Get Started
            </Link>

            <Link to="/login"
              className="border border-green-600 px-6 py-3 rounded hover:bg-green-100">
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-10 md:mt-0 grid grid-cols-2 gap-4">
          <img
            src="https://imgs.search.brave.com/YxgtwdxNy2yYuqRTstyv_NEb8hoUodQV581UF48qds0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/NTQ1LzA5MC9zbWFs/bC9waGFybWFjZXV0/aWNhbC1tZWRpY2lu/ZS1waWxscy1hbmQt/Y2Fwc3VsZXMtb24t/d29vZGVuLXRhYmxl/LWluLWRhcmstcm9v/bS1haS1nZW5lcmF0/ZWQtcHJvLXBob3Rv/LmpwZw"
            alt="Medicine Delivery"
            className="rounded-xl shadow-lg w-full"
          />
          <img
            src="https://imgs.search.brave.com/UzNuQj588Eoiu4HuRoYVe4ZJxLA_dSzBrcLY0zc4NUA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/OTUzMTY5Mi9waG90/by9zZW5pb3Itd29t/YW4tdGFraW5nLW1l/ZGljaW5lLWF0LWhv/bWUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXJYeXNzRURr/emNyRWJ1MjNtdDdX/Q0tjUkxFaC1zYWY5/dlFpR01DTzNzdTg9"
            alt="Medicines"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 md:px-20 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose HealthHaul?</h3>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="p-6 shadow rounded">
            <h4 className="font-semibold text-xl mb-2">Trusted Pharmacies</h4>
            <p className="text-gray-600">Connect with licensed pharmacies across Nepal.</p>
          </div>

          <div className="p-6 shadow rounded">
            <h4 className="font-semibold text-xl mb-2">Fast Delivery</h4>
            <p className="text-gray-600">Medicines delivered quickly to your location.</p>
          </div>

          <div className="p-6 shadow rounded">
            <h4 className="font-semibold text-xl mb-2">Easy Ordering</h4>
            <p className="text-gray-600">Order medicines in just a few clicks.</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-6">
        © {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.
      </footer>

    </div>
  );
}
