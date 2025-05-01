import React, { useState, useEffect } from "react";
import { useUserStore } from "../store/useStore";

const AddStoreModal = ({ isOpen, onClose, refreshStores }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [owners, setOwners] = useState([]);

  const fetchStoreOwners = useUserStore((state) => state.fetchStoreOwners);
  const addStore = useUserStore((state) => state.addStore);
  const fetchDashboardStats = useUserStore(
    (state) => state.fetchDashboardStats
  );
  const fetchAllUsers = useUserStore((state) => state.fetchAllUsers);

  useEffect(() => {
    const loadOwners = async () => {
      const fetchedOwners = await fetchStoreOwners();
      setOwners(fetchedOwners);
    };

    if (isOpen) {
      loadOwners();
    }
  }, [isOpen, fetchStoreOwners]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStore({ name, address, email, ownerId });
      await fetchDashboardStats();
      await fetchAllUsers();
      refreshStores();
      onClose();
    } catch (error) {
      console.error("Error creating store", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-70 backdrop-blur-sm transition-all">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
          Add New Store
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Store Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Store Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Store Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          >
            <option value="">Select Store Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Add Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
