import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === "admin@agstya.com" && password === "admin123") {
      setError("");
      navigate("/admin/dashboard");
      return;
    }
    setError("Email or password is incorrect. Please try again.");
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      <header className="bg-white border-b border-green-100 px-5 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati</p>
          </div>
          <Link to="/roles" className="text-sm font-semibold text-green-700 hover:underline">
            ← Back to Role Selection
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <section className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-sm">
          <div className="text-center mb-7">
            <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              ⚙️
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in to manage the Agstya marketplace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="admin@agstya.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold py-3 transition"
            >
              Continue to Admin Dashboard
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Demo credentials: admin@agstya.com / admin123
          </p>
        </section>
      </main>
    </div>
  );
}

export default AdminLogin;
