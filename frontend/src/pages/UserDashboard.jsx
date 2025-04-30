import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";

const UserDashboard = () => {
  const {
    user,
    stores,
    userRatings,
    fetchStores,
    fetchUserRatings,
    submitRating,
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [tempRatings, setTempRatings] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchStores();
      fetchUserRatings(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    setTempRatings(userRatings);
  }, [userRatings]);

  const handleRatingChange = (storeId, value) => {
    if (value < 1 || value > 5) return;
    setTempRatings((prev) => ({
      ...prev,
      [storeId]: parseInt(value),
    }));
  };

  const handleSubmitRating = async (storeId) => {
    const rating = tempRatings[storeId];
    if (rating >= 1 && rating <= 5) {
      await submitRating({
        userId: user.id,
        storeId,
        rating,
      });
    }
  };

  const filteredStores = Array.isArray(stores)
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>

      <input
        type="text"
        placeholder="Search by name or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <div className="space-y-4">
        {filteredStores.map((store) => (
          <div key={store.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{store.name}</h3>
            <p>Address: {store.address}</p>
            <p>Average Rating: {store.averageRating?.toFixed(1) || "N/A"}</p>
            <p>Your Rating: {userRatings[store.id] || "Not rated yet"}</p>

            <input
              type="number"
              min={1}
              max={5}
              value={tempRatings[store.id] || ""}
              onChange={(e) => handleRatingChange(store.id, e.target.value)}
              className="border p-1 w-20 mr-2"
            />
            <button
              onClick={() => handleSubmitRating(store.id)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Submit Rating
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
