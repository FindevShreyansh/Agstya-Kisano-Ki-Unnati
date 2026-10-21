import { useState } from "react";
import { Link } from "react-router-dom";
import { getSoilBookings, saveSoilBookings } from "../data/soilBookings";

function BookExpert() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    farmerName: "",
    mobileNumber: "",
    landAddress: "",
    landSizeAcres: "",
    preferredVisitDate: "",
    additionalDetails: "",
  });

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const booking = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };
    saveSoilBookings([...getSoilBookings(), booking]);
    setSubmitted(true);
  };

  const fieldClassName = "w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      <header className="bg-white border-b border-green-100 px-5 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati</p>
          </div>
          <Link to="/farmer/dashboard" className="text-sm font-semibold text-green-700 hover:underline">
            ← Farmer Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">🧪</span>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">Book Soil Analysis Expert</h2>
            <p className="mt-2 text-sm text-gray-500">
              Share your details to request a soil analysis visit from our team.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5" role="status">
              <p className="font-medium leading-relaxed text-green-800">
                Your soil analysis booking request has been submitted successfully. Our team will review your request.
              </p>
              <Link
                to="/farmer/dashboard"
                className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Return to Farmer Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="farmerName" className={labelClassName}>Farmer name</label>
                  <input id="farmerName" name="farmerName" value={form.farmerName} onChange={updateField} required className={fieldClassName} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="mobileNumber" className={labelClassName}>Mobile number</label>
                  <input id="mobileNumber" name="mobileNumber" type="tel" value={form.mobileNumber} onChange={updateField} required className={fieldClassName} autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="landSizeAcres" className={labelClassName}>Land size (acres)</label>
                  <input id="landSizeAcres" name="landSizeAcres" type="number" min="0.01" step="any" value={form.landSizeAcres} onChange={updateField} required className={fieldClassName} />
                </div>
                <div>
                  <label htmlFor="preferredVisitDate" className={labelClassName}>Preferred visit date</label>
                  <input id="preferredVisitDate" name="preferredVisitDate" type="date" value={form.preferredVisitDate} onChange={updateField} required className={fieldClassName} />
                </div>
              </div>
              <div>
                <label htmlFor="landAddress" className={labelClassName}>Complete land address</label>
                <textarea id="landAddress" name="landAddress" value={form.landAddress} onChange={updateField} required rows="3" className={fieldClassName} autoComplete="street-address" />
              </div>
              <div>
                <label htmlFor="additionalDetails" className={labelClassName}>Additional details (optional)</label>
                <textarea id="additionalDetails" name="additionalDetails" value={form.additionalDetails} onChange={updateField} rows="3" className={fieldClassName} />
              </div>
              <button type="submit" className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 sm:w-auto sm:px-6">
                Submit Booking Request
              </button>
              <p className="text-xs text-gray-500">
                Demo only: your request is saved in this browser and is not sent to a server.
              </p>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default BookExpert;
