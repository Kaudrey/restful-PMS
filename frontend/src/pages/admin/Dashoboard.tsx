import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

type SlotRequest = {
  id: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  vehicle?: string;  // If you have this info, otherwise remove
  slot: {
    slotNumber: string;
    location: string;
  };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [totalSlots, setTotalSlots] = useState<number>(0);
  const [occupiedSlots, setOccupiedSlots] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentRequests, setRecentRequests] = useState<SlotRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const statusStyle = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };

  useEffect(() => {
    const fetchSlotData = async () => {
      try {
        const [totalRes, occupiedRes] = await Promise.all([
          api.get("/slots"),
          api.get("/slots/occupied"),
        ]);
        setTotalSlots(totalRes.data.total);
        setOccupiedSlots(occupiedRes.data.total);
      } catch (error) {
        console.error("Failed to fetch slots data:", error);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/slot-requests/pending");
        const pending = response.data.filter((req: any) => req.status === "PENDING");
        setPendingCount(pending.length);
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      }
    };

    const fetchRecentRequests = async () => {
      try {
        const res = await api.get("/slot-requests/all-requests");
        // Get the latest 4 requests (adjust as you want)
        const latestRequests = res.data.slice(0, 4);
        setRecentRequests(latestRequests);
      } catch (error) {
        console.error("Failed to fetch recent requests:", error);
      }
    };

    Promise.all([fetchSlotData(), fetchPendingRequests(), fetchRecentRequests()])
      .finally(() => setLoading(false));
  }, []);

  const availableSlots = totalSlots - occupiedSlots;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-2 shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-6">Parking Admin</h1>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 rounded-lg bg-blue-100 text-blue-700">Dashboard</Link>
          <Link to="/users" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
          <Link to="/vehicles" className="block px-4 py-2 hover:bg-gray-100">Vehicles</Link>
          <Link to="/slots" className="block px-4 py-2 hover:bg-gray-100">Parking Slots</Link>
          <Link to="/requests" className="block px-4 py-2 hover:bg-gray-100">Requests</Link>
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
        </nav>
        <Link to="/logout" className="block px-4 py-2 mt-6 text-red-600 hover:bg-red-100">Logout</Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card 
            title="Total Slots" 
            value={loading ? "Loading..." : totalSlots.toString()} 
          />
          <Card 
            title="Occupied" 
            value={loading ? "Loading..." : occupiedSlots.toString()}  
          />
          <Card 
            title="Available" 
            value={loading ? "Loading..." : availableSlots.toString()} 
          />
          <Card 
            title="Pending Requests" 
            value={loading ? "Loading..." : pendingCount.toString()} 
          />
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Slot Requests</h3>
            <Link to="/requests" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Slot</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-4">Loading recent requests...</td></tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{req.user?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.user?.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{req.slot?.slotNumber} - {req.slot?.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[req.status as keyof typeof statusStyle] || "bg-gray-100 text-gray-600"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: string; }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
