import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddSlot = () => {
  const navigate = useNavigate();
  const [slotNumber, setSlotNumber] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/slots/add", {
        slotNumber,
        location,
      });
      // Redirect to slots list page after success
      navigate("/slots");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Add New Parking Slot</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Slot Number</label>
          <input
            type="text"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. A5"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. Near Exit Gate"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
