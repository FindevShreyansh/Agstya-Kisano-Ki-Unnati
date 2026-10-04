import { Link } from "react-router-dom";

function FarmerRegister() {
  return (
    <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            AGSTYA
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kisano Ki Unnati
          </p>
        </div>


        {/* Registration Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 md:p-10">

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-4">
              👨‍🌾
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Create Your Farmer Profile
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Tell us a little about yourself and your farm.
            </p>

          </div>


          <form className="space-y-6">

            {/* Personal Information */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

              </div>
            </div>


            {/* Farm Information */}
            <div className="border-t border-gray-100 pt-6">

              <h3 className="font-semibold text-gray-800 mb-4">
                Farm Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>

                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-green-500">
                    <option>Select state</option>
                    <option>Karnataka</option>
                    <option>Uttar Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Punjab</option>
                    <option>Haryana</option>
                    <option>Madhya Pradesh</option>
                    <option>Rajasthan</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>

                  <input
                    type="text"
                    placeholder="Enter district"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Area
                  </label>

                  <div className="flex">

                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3 rounded-l-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 flex items-center rounded-r-xl text-sm text-gray-600">
                      Acres
                    </span>

                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Crop
                  </label>

                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-green-500">
                    <option>Select crop</option>
                    <option>Rice</option>
                    <option>Wheat</option>
                    <option>Maize</option>
                    <option>Sugarcane</option>
                    <option>Cotton</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>

            </div>


            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-500">
              <input
                type="checkbox"
                className="mt-1"
              />

              <span>
                I agree to Agstya's terms and understand that my
                information will be used to provide agricultural
                services and opportunities.
              </span>
            </label>


            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-medium transition"
            >
              Create Farmer Account →
            </button>

          </form>


          {/* Login */}
          <div className="text-center mt-7 text-sm text-gray-500">

            Already have an account?

            <Link
              to="/farmer/login"
              className="text-green-700 font-semibold ml-1 hover:underline"
            >
              Login
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

export default FarmerRegister;