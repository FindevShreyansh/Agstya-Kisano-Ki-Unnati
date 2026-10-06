import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-gray-800">

      {/* Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 md:px-12 py-5 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-wide text-green-800">
            AGSTYA
          </h1>

          <p className="text-xs text-gray-500">
            किसानों की उन्नति
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#" className="hover:text-green-700">
            Home
          </a>

          <a href="#about" className="hover:text-green-700">
            About
          </a>

          <a href="#features" className="hover:text-green-700">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-green-700">
            How It Works
          </a>
        </div>

        <button
          onClick={() => navigate("/roles")}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
        >
          Get Started
        </button>

      </nav>


      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-14 items-center">

        {/* Left */}
        <div>

          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🌾 Empowering Indian Farmers
          </span>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight text-gray-800">
            Better Farming.
            <span className="block text-green-700">
              Better Opportunities.
            </span>
          </h2>

          <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-xl">
            Agstya helps farmers make better crop decisions,
            understand their soil, discover market opportunities
            and connect with the right buyers.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <button
              onClick={() => navigate("/roles")}
              className="bg-green-700 hover:bg-green-800 text-white px-7 py-3.5 rounded-full font-medium transition shadow-lg shadow-green-700/20"
            >
              Get Started →
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-green-200 bg-white text-green-700 px-7 py-3.5 rounded-full font-medium hover:bg-green-50 transition"
            >
              Explore Agstya
            </button>

          </div>

        </div>


        {/* Right */}
        <div className="relative">

          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
            alt="Agriculture"
            className="w-full h-[430px] object-cover rounded-[35px] shadow-xl"
          />

          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              🌱
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                Smart Farming
              </p>

              <p className="text-xs text-gray-500">
                Better decisions, better growth
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* About */}
      <section
        id="about"
        className="bg-white py-20 px-6 md:px-12"
      >

        <div className="max-w-4xl mx-auto text-center">

          <span className="text-green-700 font-semibold text-sm">
            ABOUT AGSTYA
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            From better decisions to better opportunities.
          </h2>

          <p className="mt-5 text-gray-500 leading-relaxed">
            Farmers often face challenges in deciding what to grow,
            understanding their soil, finding the right market and
            getting better value for their produce. Agstya brings
            these opportunities together in one platform.
          </p>

        </div>

      </section>


      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 md:px-12 py-20"
      >

        <div className="text-center mb-12">

          <span className="text-green-700 font-semibold text-sm">
            WHAT AGSTYA OFFERS
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Everything farmers need to grow smarter
          </h2>

        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {[
            {
              icon: "🌱",
              title: "Smart Crop Planning",
              text: "Get suitable crop suggestions based on farm conditions."
            },
            {
              icon: "🧪",
              title: "Soil Analysis",
              text: "Understand your soil and identify suitable crops."
            },
            {
              icon: "🤝",
              title: "Buyer Connection",
              text: "Connect farmers with suitable buyers and market demand."
            },
            {
              icon: "📈",
              title: "Profit Planning",
              text: "Compare expected costs, revenue and profitability."
            }
          ].map((feature) => (

            <div
              key={feature.title}
              className="bg-white border border-green-100 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg transition"
            >

              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                {feature.icon}
              </div>

              <h3 className="font-semibold text-lg mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.text}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-green-900 text-white py-20 px-6 md:px-12"
      >

        <div className="max-w-6xl mx-auto text-center">

          <span className="text-green-300 font-semibold text-sm">
            HOW IT WORKS
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            From farm to opportunity
          </h2>


          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mt-14">

            {[
              ["01", "Understand", "Know your farm and soil"],
              ["02", "Plan", "Choose suitable crops"],
              ["03", "Grow", "Make informed decisions"],
              ["04", "Connect", "Find the right buyers"],
              ["05", "Earn", "Create better value"]
            ].map(([number, title, text]) => (

              <div key={number}>

                <div className="text-green-300 text-sm font-bold mb-3">
                  {number}
                </div>

                <h3 className="text-lg font-semibold">
                  {title}
                </h3>

                <p className="text-green-100/70 text-sm mt-2">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="py-20 px-6 text-center bg-green-50">

        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to grow with Agstya?
        </h2>

        <p className="text-gray-500 mt-4">
          Join a smarter agricultural ecosystem.
        </p>

        <button
          onClick={() => navigate("/roles")}
          className="mt-7 bg-green-700 hover:bg-green-800 text-white px-8 py-3.5 rounded-full font-medium transition"
        >
          Start Your Journey →
        </button>

      </section>


      {/* Footer */}
      <footer className="bg-white border-t border-green-100 py-7 text-center">

        <h3 className="font-bold text-green-800">
          AGSTYA
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Kisano Ki Unnati
        </p>

      </footer>

    </div>
  );
}

export default Home;
