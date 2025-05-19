// pages/Users.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("admin/all-users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log("Edit user with ID:", userId);
    // Example: navigate to edit page
    // navigate(`/users/edit/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Role badge styling
  const roleStyles = {
    ADMIN: "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs",
    USER: "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - unchanged */}
      <aside className="w-64 bg-white border-r p-4 space-y-2 shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-6">Parking Admin</h1>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
          <Link to="/users" className="block px-4 py-2 rounded-lg bg-blue-100 text-blue-700">Users</Link>
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
          <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">USER</th>
                    <th className="px-6 py-3">EMAIL</th>
                    <th className="px-6 py-3">ROLE</th>
                    <th className="px-6 py-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={roleStyles[u.role as keyof typeof roleStyles] || roleStyles.USER}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(u.id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
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

export default Users;