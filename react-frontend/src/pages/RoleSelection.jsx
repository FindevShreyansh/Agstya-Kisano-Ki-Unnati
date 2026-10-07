import { useNavigate } from "react-router-dom";
function RoleSelection() {
    const navigate = useNavigate();
  const roles = [
    {
      title: "Farmer",
      description: "Manage your farm, analyze soil, plan crops and connect with buyers.",
      icon: "👨‍🌾",
    },
    {
      title: "Buyer",
      description: "Find farmers, post crop requirements and source agricultural products.",
      icon: "🏢",
    },
    {
      title: "Admin",
      description: "Manage farmers, buyers, crops, procurement and platform activities.",
      icon: "⚙️",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf7] flex flex-col">

      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white border-b border-green-100">
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            AGSTYA
          </h1>

          <p className="text-xs text-gray-500">
            Kisano Ki Unnati
          </p>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="text-sm text-gray-600 hover:text-green-700"
        >
          ← Back
        </button>
      </header>


      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        <div className="text-center max-w-2xl mb-12">

          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-5">
            🌱 Welcome to Agstya
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
            How would you like to
            <span className="text-green-700"> continue?</span>
          </h2>

          <p className="text-gray-500 text-lg">
            Choose your role to access the right tools and
            opportunities on Agstya.
          </p>

        </div>


        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">

          {roles.map((role) => (
            <div
              key={role.title}
              className="group bg-white border border-green-100 rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-green-300"
            >

              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-green-50 flex items-center justify-center text-4xl group-hover:bg-green-100 transition">
                {role.icon}
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {role.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm mb-7">
                {role.description}
              </p>

              <button 
                onClick={() => {
                  if (role.title === "Buyer") {
                    navigate("/buyer/login");
                  } else if (role.title === "Admin") {
                    navigate("/admin/login");
                  } else {
                    navigate("/farmer/login");
                  }
                }} 
                className="w-full py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 transition"
              >
                Continue as {role.title}
              </button>

            </div>
          ))}

        </div>

      </main>


      {/* Footer */}
      <footer className="text-center py-5 text-sm text-gray-400">
        Empowering farmers. Connecting opportunities. 🌱
      </footer>

    </div>
  );
}

export default RoleSelection;