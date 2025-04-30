import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";
import AddUserModal from "../components/AddUserModal";
import AddStoreModal from "../components/AddStoreModal";

const AdminDashboard = () => {
  const {
    user,
    summary,
    allUsers,
    allStores,
    filters,
    setFilters,
    fetchDashboardStats,
    fetchAllUsers,
    fetchAllStores,
  } = useUserStore();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchAllUsers();
    fetchAllStores();
  }, []);

  const filteredUsers = allUsers.filter((u) => {
    return (
      u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      u.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      u.address.toLowerCase().includes(filters.search.toLowerCase()) ||
      u.role.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  return (
    <div className="mt-20 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome Admin: {user?.name}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add User
          </button>
          <button
            onClick={() => setShowStoreModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-gray-700">Total Users</p>
          <h2 className="text-xl font-bold">{summary.users}</h2>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-gray-700">Total Stores</p>
          <h2 className="text-xl font-bold">{summary.stores}</h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-gray-700">Total Ratings</p>
          <h2 className="text-xl font-bold">{summary.ratings}</h2>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter Users/Stores</h2>
        <input
          type="text"
          placeholder="Search by name, email, address, role"
          className="w-full p-2 border rounded"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.address}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Stores</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {allStores.map((s, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.address}</td>
                <td className="p-2">{s.rating || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        refreshUsers={fetchAllUsers}
      />

      <AddStoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        refreshStores={fetchAllStores}
      />
    </div>
  );
};

export default AdminDashboard;
