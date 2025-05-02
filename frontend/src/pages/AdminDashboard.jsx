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
  const [storeSearch, setStoreSearch] = useState("");

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

  const filteredStores = allStores.filter((s) => {
    return (
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.address.toLowerCase().includes(storeSearch.toLowerCase())
    );
  });

  return (
    <div className="mt-20 p-6 mx-auto text-gray-800 max-w-9xl font-inter">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome Admin, <span className="text-blue-600">{user?.name}</span>
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white px-6 py-2 rounded-xl shadow-lg transition-all"
          >
            + Add User
          </button>
          <button
            onClick={() => setShowStoreModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 text-white px-6 py-2 rounded-xl shadow-lg transition-all"
          >
            + Add Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Total Users", count: summary.users, color: "blue" },
          { title: "Total Stores", count: summary.stores, color: "green" },
          { title: "Total Ratings", count: summary.ratings, color: "yellow" },
        ].map(({ title, count, color }) => (
          <div
            key={title}
            className={`bg-white/70 backdrop-blur-md border-l-4 border-${color}-500 p-6 rounded-2xl shadow-md hover:scale-[1.02] transition-transform`}
          >
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold text-${color}-700">{count}</h2>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🔍 Search Users</h2>
        <input
          type="text"
          placeholder="Search by name, email, address, role"
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">👤 All Users</h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full text-left border bg-white rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr className="text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Address</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.address}</td>
                  <td className="p-4 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🏪 Search Stores</h2>
        <input
          type="text"
          placeholder="Search by name, email, or address"
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={storeSearch}
          onChange={(e) => setStoreSearch(e.target.value)}
        />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🏬 All Stores</h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full text-left border bg-white rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr className="text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Address</th>
                <th className="p-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.address}</td>
                  <td className="p-4">
                    {s.averageRating
                      ? parseFloat(s.averageRating).toFixed(1)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
