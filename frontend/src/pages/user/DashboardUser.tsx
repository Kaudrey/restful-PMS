// pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const recentRequests = [
    { id: 1, user: "John Doe", vehicle: "ABC-1234", slot: "A1", status: "approved" },
    { id: 2, user: "Jane Smith", vehicle: "XYZ-5678", slot: "B2", status: "pending" },
    { id: 3, user: "Alice Brown", vehicle: "JKL-9101", slot: "C3", status: "rejected" },
    { id: 4, user: "Bob Lee", vehicle: "MNO-2345", slot: "D4", status: "approved" },
  ];

  const statusStyle = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Reverted to original white style */}
      <aside className="w-64 bg-white border-r p-4 space-y-2 shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-6">Parking User</h1>
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
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">AD
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>

        {/* Metrics - Restored all 4 cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card title="Total Slots" value="150" trend="5% ↑" />
          <Card title="Occupied" value="112" trend="3% ↑" />
          <Card title="Available" value="38" trend="2% ↑" />
          <Card title="Pending Requests" value="17" trend="4% ↑" />
        </div>

        {/* Recent Requests - Kept your improved table styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Slot Requests</h3>
            <Link to="/requests" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Slot</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{req.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.slot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[req.status as keyof typeof statusStyle]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, trend }: { title: string; value: string; trend: string }) => {
  const isPositive = trend.includes('↑');
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} bg-${isPositive ? 'green' : 'red'}-100 px-2 py-1 rounded-full`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;