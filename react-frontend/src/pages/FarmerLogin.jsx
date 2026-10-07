import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FarmerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/farmer/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            AGSTYA
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            किसानों की उन्नति
          </p>
        </div>


        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-4">
              👨‍🌾
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back, Farmer
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Login to manage your farm and opportunities.
            </p>

          </div>


          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>


            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-green-700 hover:text-green-800 font-medium"
              >
                Forgot Password?
              </button>

            </div>


            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-medium transition"
            >
              Login as Farmer →
            </button>

          </form>


          {/* Register */}
          <div className="text-center mt-7 text-sm text-gray-500">

            Don't have an account?

            <Link
              to="/farmer/register"
              className="text-green-700 font-semibold ml-1 hover:underline"
            >
              Register
            </Link>

          </div>

        </div>


        {/* Back */}
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

export default FarmerLogin;