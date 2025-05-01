import React from "react";
import { useUserStore } from "../store/useStore";

const AddUserModal = ({ isOpen, onClose, refreshUsers }) => {
  const fetchDashboardStats = useUserStore(
    (state) => state.fetchDashboardStats
  );

  if (!isOpen) return null;

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      name: form.name.value,
      email: form.email.value,
      address: form.address.value,
      role: form.role.value,
      password: form.password.value,
    };

    try {
      await useUserStore.getState().addUser(newUser);
      await fetchDashboardStats();
      form.reset();
      refreshUsers();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative animate-fadeIn">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
          Add New User
        </h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <select
            name="role"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select Role</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
