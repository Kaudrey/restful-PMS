import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api"; // adjust if needed

type Slot = {
  id: string;
  slotNumber: string;
  type: string;
  inUse: boolean;
  vehicle?: string | null;
  // add other fields you have if any
};

type ParkingRow = {
  name: string;
  spots: Slot[];
};

const statusStyles = {
  Available: "bg-green-100 text-green-700",
  Occupied: "bg-red-100 text-red-700",
};

const Slots = () => {
  const { user } = useAuth();
  const [parkingRows, setParkingRows] = useState<ParkingRow[]>([
    { name: "Row A", spots: [] },
    { name: "Row B", spots: [] },
    { name: "Row C", spots: [] },
    { name: "Row D", spots: [] },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get("/slots"); // backend endpoint
        const slots: Slot[] = res.data.data || res.data; 

        const rows: Record<string, Slot[]> = { A: [], B: [], C: [], D: [] };

        slots.forEach((slot) => {
          const rowLetter = slot.slotNumber.charAt(0).toUpperCase();
          if (["A", "B", "C", "D"].includes(rowLetter)) {
            rows[rowLetter].push(slot);
          }
        });

        setParkingRows([
          { name: "Row A", spots: rows.A },
          { name: "Row B", spots: rows.B },
          { name: "Row C", spots: rows.C },
          { name: "Row D", spots: rows.D },
        ]);
      } catch (error) {
        console.error("Failed to fetch parking slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
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
          <Link to="/slots" className="block px-4 py-2 rounded-lg bg-blue-100 text-blue-700">Parking Slots</Link>
          <Link to="/requests" className="block px-4 py-2 hover:bg-gray-100">Requests</Link>
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
        </nav>
        <Link to="/logout" className="block px-4 py-2 mt-6 text-red-600 hover:bg-red-100">Logout</Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Parking Lot Visualization</h2>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">{user?.email}</span>
            </div>

            <Link
              to="/slots/new"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              + Add New Slot
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading parking slots...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {parkingRows.map((row) => (
              <div key={row.name} className="mb-8">
                <h4 className="font-bold text-gray-700 mb-3">{row.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {row.spots.length === 0 ? (
                    <p className="text-gray-400 italic">No spots in this row</p>
                  ) : (
                    row.spots.map((spot) => {
                      const status = spot.inUse ? "Occupied" : "Available";
                      return (
                        <div key={spot.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{spot.type}</span>
                            <span className="text-gray-500">{spot.slotNumber}</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${statusStyles[status]}`}>
                            {status}
                          </div>
                          {spot.vehicle && (
                            <div className="mt-2 text-sm text-gray-600">
                              Vehicle: {spot.vehicle}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Slots;
