// pages/Requests.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api"; // make sure the path matches your folder structure

type SlotRequest = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  totalTime: number;
  totalCharge: number;
  user: {
    name: string;
    email: string;
  };
  slot: {
    slotNumber: string;
    location: string;
  };
};

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SlotRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/slot-requests/all-requests");
        setRequests(res.data); // if it's wrapped
; // adjust if your response has a data key like res.data.data
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-2 shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-6">Parking Admin</h1>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
          <Link to="/users" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
          <Link to="/vehicles" className="block px-4 py-2 hover:bg-gray-100">Vehicles</Link>
          <Link to="/slots" className="block px-4 py-2 hover:bg-gray-100">Parking Slots</Link>
          <Link to="/requests" className="block px-4 py-2 rounded-lg bg-blue-100 text-blue-700">Requests</Link>
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
        </nav>
        <Link to="/logout" className="block px-4 py-2 mt-6 text-red-600 hover:bg-red-100">Logout</Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Parking Requests</h2>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">All Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Slot</th>
                    <th className="px-6 py-3">Total Time</th>
                    <th className="px-6 py-3">Charge</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{r.user?.name}</td>
                      <td className="px-6 py-4">{r.user?.email}</td>
                      <td className="px-6 py-4">{r.slot?.slotNumber} - {r.slot?.location}</td>
                      <td className="px-6 py-4">{r.totalTime} min</td>
                     <td className="px-6 py-4">
  {typeof r.totalCharge === "number" ? `$${r.totalCharge.toFixed(2)}` : "N/A"}
</td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[r.status as keyof typeof statusStyles] || "bg-gray-100 text-gray-600"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Requests;
