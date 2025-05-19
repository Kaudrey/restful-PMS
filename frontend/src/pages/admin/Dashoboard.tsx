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
    <div className="flex h-screen">
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
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">AD</div>
            <span className="font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card title="Total Slots" value="150" trend="↑ 5%" color="green" />
          <Card title="Occupied" value="112" trend="↑ 3%" color="green" />
          <Card title="Available" value="38" trend="↓ 2%" color="red" />
          <Card title="Pending Requests" value="17" trend="↑ 4%" color="green" />
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Slot Requests</h3>
            <Link to="/requests" className="text-blue-600 hover:underline">View All</Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th>ID</th>
                <th>User</th>
                <th>Vehicle</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(req => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td>{req.id}</td>
                  <td>{req.user}</td>
                  <td>{req.vehicle}</td>
                  <td>{req.slot}</td>
                  <td><span className={`px-2 py-1 rounded text-xs ${statusStyle[req.status as keyof typeof statusStyle]}`}>{req.status}</span></td>
                  <td><Link to={`/requests/${req.id}`} className="text-blue-600 hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, trend, color }: { title: string; value: string; trend: string; color: "green" | "red" }) => {
  const trendColor = color === "green" ? "text-green-500" : "text-red-500";
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${trendColor}`}>{trend}</p>
    </div>
  );
};

export default Dashboard;
