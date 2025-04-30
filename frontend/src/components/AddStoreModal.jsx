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
      refreshStores();
      onClose();
    } catch (error) {
      console.error("Error creating store", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Store</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Store Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Store Address"
            className="w-full p-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="email"
            placeholder="Store Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
          >
            <option value="">Select Store Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
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
