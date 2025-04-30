import React from "react";
import { useUserStore } from "../store/useStore";

const AddUserModal = ({ isOpen, onClose, refreshUsers }) => {
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
      alert("User added successfully");
      form.reset();
      refreshUsers();
      onClose();
    } catch (err) {
      alert("Failed to add user");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="grid gap-3">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            className="p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            required
          />
          <select name="role" className="p-2 border rounded" required>
            <option value="">Select Role</option>
            <option value="USER">Normal User</option>
            <option value="STORE-OWNER">Store</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
