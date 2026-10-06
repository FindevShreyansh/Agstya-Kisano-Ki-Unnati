import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BuyerLogin() {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Frontend demo mock login - redirects directly to Buyer Dashboard
    navigate("/buyer/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo & Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            AGSTYA
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kisano Ki Unnati • Buyer Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-4">
              🏢
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back, Buyer
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Login to post requirements and discover farmer produce.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email / Mobile
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. buyer@traders.com or 9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                Remember me
              </label>
              <button
                type="button"
                className="text-green-700 hover:text-green-800 font-medium text-xs"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-medium transition duration-200 shadow-sm"
            >
              Login as Buyer →
            </button>
          </form>

          {/* Registration Hint */}
          <div className="text-center mt-7 text-sm text-gray-500">
            Procuring for your business?{" "}
            <span className="text-green-700 font-medium">Demo Instant Access</span>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/roles"
            className="text-sm text-gray-500 hover:text-green-700"
          >
            ← Choose another role
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BuyerLogin;
