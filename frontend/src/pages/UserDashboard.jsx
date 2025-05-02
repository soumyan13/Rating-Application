import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className="text-yellow-400 text-xl" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className="text-yellow-400 text-xl" />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-xl" />
    );
  }

  return stars;
};

const UserDashboard = () => {
  const {
    user,
    stores,
    userRatings,
    fetchStores,
    fetchAverageRatings,
    averageRatings,
    submitRating,
    updatePassword,
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [tempRatings, setTempRatings] = useState({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStores().then(() => {
        fetchAverageRatings();
      });
    }
  }, [user?.id]);

  useEffect(() => {
    setTempRatings(userRatings);
  }, [userRatings]);

  const handleInputChange = (storeId, value) => {
    let val = parseFloat(value);
    if (val >= 0 && val <= 5) {
      setTempRatings((prev) => ({
        ...prev,
        [storeId]: val,
      }));
    }
  };

  const handleSubmitRating = async (storeId) => {
    const rating = tempRatings[storeId];
    if (rating >= 0 && rating <= 5) {
      await submitRating({ storeId, rating });
      fetchAverageRatings();
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
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
    <div className="relative p-6 mt-18 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="absolute right-6 top-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
          onClick={() => setShowPasswordForm((prev) => !prev)}
        >
          {showPasswordForm ? "Cancel" : "Update Password"}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordUpdate}
            className="mt-2 bg-white border shadow-lg p-4 rounded-xl w-72 space-y-3"
          >
            <h3 className="font-bold text-lg text-gray-700">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        )}
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome User,{" "}
        <span className="text-blue-800 text-4xl">{user?.name}</span>
      </h2>

      <input
        type="text"
        placeholder="Search stores..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              {store.name}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Address:</span> {store.address}
            </p>

            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span className="font-medium">Average Rating:</span>
              <span className="flex gap-0.5">
                {renderStars(averageRatings[store.id] || 0)}
              </span>
              <span className="text-gray-600 text-xs ml-1">
                ({averageRatings[store.id]?.toFixed(1) || "N/A"})
              </span>
            </p>

            <p className="text-sm text-gray-700 mt-1 flex items-center gap-2">
              <span className="font-medium">Your Rating:</span>
              <span className="flex gap-0.5">
                {renderStars(userRatings[store.id] || 0)}
              </span>
              <span className="text-gray-600 text-xs ml-1">
                ({userRatings[store.id]?.toFixed(1) || "Not rated"})
              </span>
            </p>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={tempRatings[store.id] || ""}
                onChange={(e) => handleInputChange(store.id, e.target.value)}
                placeholder="1.0 to 5.0"
                className="w-24 p-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={() => handleSubmitRating(store.id)}
                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
